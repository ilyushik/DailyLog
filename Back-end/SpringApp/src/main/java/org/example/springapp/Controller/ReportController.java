package org.example.springapp.Controller;

import org.example.springapp.Model.User;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/report")
public class ReportController {

    @Autowired
    private ReportService reportService;
    @Autowired
    private UserRepository userRepository;

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
}
