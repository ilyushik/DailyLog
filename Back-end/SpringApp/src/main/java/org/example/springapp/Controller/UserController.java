package org.example.springapp.Controller;

import org.example.springapp.DTO.RequestDTO;
import org.example.springapp.Model.Request;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Service.RequestService;
import org.example.springapp.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;

@RestController
@RequestMapping("")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RequestService requestService;

    @GetMapping("/getMyInfo")
    public ResponseEntity<?> getMyInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(userService.userByEmail(email));
    }

    @GetMapping("/users")
    public ResponseEntity<?> users() {
        if (userService.users().isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "No users found"));
        }

        return ResponseEntity.ok(userService.users());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> userById(@PathVariable int id) {
        if (userService.userById(id) == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User not found"));
        }

        return ResponseEntity.ok(userService.userById(id));
    }

    @PostMapping("/addRequest")
    public ResponseEntity<?> addRequest(@RequestBody RequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        if (requestDTO.getReason() == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("reason", "Is empty"));
        }

        if (user == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User not found"));
        }

        if (requestDTO.getReason().equals("Personal Leave")) {
            if ((ChronoUnit.DAYS.between(requestDTO.getStartDate(), requestDTO.getFinishDate()) + 1) > user.getDaysToSkip()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("errorDate", "You have only " + user.getDaysToSkip() + " days to skip"));
            }
        }

        if (requestDTO.getReason().equals("Sick Leave")) {
            if ((ChronoUnit.DAYS.between(requestDTO.getStartDate(), requestDTO.getFinishDate()) + 1) > user.getDaysToSkip()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("errorDate", "You have only " + user.getDaysToSkip() + " days to skip"));
            }
        }

        if (requestDTO.getReason().equals("Annual Leave")) {
            if ((ChronoUnit.DAYS.between(requestDTO.getStartDate(), requestDTO.getFinishDate()) + 1) > user.getDaysForVacation()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("errorDate", "You have only " + user.getDaysForVacation() + " days for vacation"));
            }
        }

        if (requestDTO.getStartDate().isBefore(LocalDate.now()) || requestDTO.getFinishDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("errorDate", "Date before current"));
        }

        if (requestDTO.getFinishDate().isBefore(requestDTO.getStartDate())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("errorDate", "Finish date before start date"));
        }

        return ResponseEntity.ok(requestService.addRequest(user.getId(), requestDTO));
    }

    @GetMapping("/peopleList")
    public ResponseEntity<?> peopleList() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (userService.usersByLead(user.getId()).isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Users not found"));
        }

        return ResponseEntity.ok(userService.usersByLead(user.getId()));
    }
}
