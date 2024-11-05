package org.example.springapp.Controller;

import org.example.springapp.DTO.ReportDTO;
import org.example.springapp.Model.Report;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.ReportRepository;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/report")
public class ReportController {

    @Autowired
    private ReportService reportService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReportRepository reportRepository;

    @GetMapping("/usersReports")
    public ResponseEntity<?> getReport() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        assert user != null;
        if (reportService.getReportsByUserId(user.getId()).isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "No reports"));
        }

        return ResponseEntity.ok(reportService.getReportsByUserId(user.getId()));
    }

    @PostMapping("add-report")
    public ResponseEntity<?> addReport(@RequestBody ReportDTO reportDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        List<ReportDTO> usersReportsByDate = reportService.getReportsByUserId(user.getId()).stream().filter(s->s.getDate().equals(reportDTO.getDate())).collect(Collectors.toList());
        if (!usersReportsByDate.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Report already exists"));
        }

        return ResponseEntity.ok(reportService.addReport(reportDTO, user));
    }
}
