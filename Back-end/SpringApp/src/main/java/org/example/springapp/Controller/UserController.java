package org.example.springapp.Controller;

import org.example.springapp.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping()
    public ResponseEntity<?> users() {
        if (userService.users().isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "No users found"));
        }

        return ResponseEntity.ok(userService.users());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> userById(@PathVariable int id) {
        if (userService.userById(id) == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User not found"));
        }

        return ResponseEntity.ok(userService.userById(id));
    }
}
