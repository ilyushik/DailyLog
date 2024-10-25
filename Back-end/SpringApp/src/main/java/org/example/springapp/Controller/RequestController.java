package org.example.springapp.Controller;

import org.example.springapp.Model.User;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{id}")
    public ResponseEntity<?> requestByUserId(@PathVariable int id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User not found"));
        }

        if (requestService.combinedList(id).isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "No request found"));
        }

        return ResponseEntity.ok(requestService.combinedList(id));
    }

    @GetMapping("/approver/{id}")
    public ResponseEntity<?> requestsByApprover(@PathVariable int id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User not found"));
        }

        if (requestService.findByApprover(id).isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "No request found"));
        }

        return ResponseEntity.ok(requestService.findByApprover(id));
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveRequest(@PathVariable int id) {
        return ResponseEntity.ok(requestService.approveRequest(id));
    }

    @PostMapping("/decline/{id}")
    public ResponseEntity<?> declineRequest(@PathVariable int id) {
        return ResponseEntity.ok(requestService.declineRequest(id));
    }
}
