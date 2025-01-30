package org.example.springapp.Controller;

import org.example.springapp.DTO.RequestDTO;
import org.example.springapp.Model.Report;
import org.example.springapp.Model.Request;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.ReportRepository;
import org.example.springapp.Repository.RequestRepository;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/requests")
@CrossOrigin("*")
public class RequestController {
    @Autowired
    private RequestService requestService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private ReportRepository reportRepository;

    @GetMapping("")
    public ResponseEntity<?> requestByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User not found"));
        }

        if (requestService.combinedList(user.getId()).isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "No request found"));
        }

        return ResponseEntity.ok(requestService.combinedList(user.getId()));
    }

    @GetMapping("/userRequests/{id}")
    public ResponseEntity<?> requestByUserId(@PathVariable int id) {

        if (requestService.combinedList(id).isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "No request found"));
        }

        return ResponseEntity.ok(requestService.combinedList(id));
    }

    @GetMapping("/approver")
    public ResponseEntity<?> requestsByApprover() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User not found"));
        }

        if (requestService.findByApprover(user.getId()).isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "No request found"));
        }

        return ResponseEntity.ok(requestService.findByApprover(user.getId()));
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveRequest(@PathVariable int id) {
        return ResponseEntity.ok(requestService.approveRequest(id));
    }

    @PostMapping("/decline/{id}")
    public ResponseEntity<?> declineRequest(@PathVariable int id) {
        return ResponseEntity.ok(requestService.declineRequest(id));
    }

    @GetMapping("/request/{id}")
    public ResponseEntity<?> requestById(@PathVariable int id) {
        if (requestService.getRequestById(id) == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Request not found"));
        }

        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @GetMapping("/delete/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable int id) {
        return ResponseEntity.ok(requestService.deleteRequest(id));
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateRequest(@PathVariable int id, @RequestBody RequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        List<Request> allRequest = requestRepository.findAll();
        allRequest = allRequest.stream().filter(r-> r.getUser().equals(user)).toList();
        allRequest = allRequest.stream().filter(r->r.getStatus().getStatus().equals("Declined")).toList();
        allRequest = allRequest.stream().filter(r->r.getUniqueCode().equals(requestDTO.getUniqueCode())).toList();
        List<LocalDate> allDate = new ArrayList<>();
        LocalDate currentDate = requestDTO.getStartDate();

        List<Report> allReports = reportRepository.findAll();
        allReports = allReports.stream().filter(r->r.getUser().equals(user)).toList();

        if (requestDTO.getStartDate().isBefore(LocalDate.now()) || requestDTO.getFinishDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("errorDate", "Date cannot be before current"));
        }
        if (requestDTO.getStartDate().isAfter(requestDTO.getFinishDate())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("errorDate",
                    "Start date cannot be after finish date"));
        }

        // getting the list of dates from request
        while (!currentDate.isAfter(requestDTO.getFinishDate())) {
            allDate.add(currentDate);
            currentDate = currentDate.plusDays(1);
        }

        // checking if the date exists in pending request
        if (!allRequest.isEmpty()) {
            for (LocalDate date : allDate) {
                for (Request request : allRequest) {
                    LocalDate requestCurrentDate = request.getStartDate();
                    List<LocalDate> requestDates = new ArrayList<>();

                    while (requestCurrentDate.isBefore(request.getFinishDate())) {
                        requestDates.add(requestCurrentDate);
                        requestCurrentDate = requestCurrentDate.plusDays(1);
                    }

                    for (LocalDate requestDate : requestDates) {
                        if (date.isEqual(requestDate)) {
                            return ResponseEntity.badRequest()
                                    .body(Collections.singletonMap("errorDate", "The date " + date
                                            + " is already in the request"));
                        }
                    }
                }
            }
        }

        // checking if the date exists in approved requests
        if (!allReports.isEmpty()) {
            for (LocalDate date : allDate) {
                for (Report report : allReports) {
                    if (date.isEqual(report.getDate())) {
                        return ResponseEntity.badRequest().body(Collections.singletonMap("errorDate",
                                "The date " + date + " is already in the report"));
                    }
                }
            }
        }

        return ResponseEntity.ok(requestService.updateRequest(id, requestDTO));
    }
}
