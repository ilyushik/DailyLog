package org.example.springapp.Controller;

import lombok.RequiredArgsConstructor;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Security.AuthenticationRequest;
import org.example.springapp.Security.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository repository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        User user = repository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("email", "User with this email does not exist"));
        }
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("password", "Invalid password"));
        }
        return ResponseEntity.ok(service.login(request));
    }
}
