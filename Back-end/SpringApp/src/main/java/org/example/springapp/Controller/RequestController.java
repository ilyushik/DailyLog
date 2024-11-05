package org.example.springapp.Controller;

import org.example.springapp.Model.User;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/requests")
@CrossOrigin("*")
public class RequestController {
    @Autowired
    private RequestService requestService;
    @Autowired
    private UserRepository userRepository;

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

}
