package org.example.springapp.Controller;

import org.example.springapp.Service.RequestReasonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reasons")
@CrossOrigin("*")
public class RequestReasonsController {
    @Autowired
    private RequestReasonService requestReasonService;

    @GetMapping()
    public ResponseEntity<?> requestReasons() {
        return ResponseEntity.ok(requestReasonService.reasons());
    }
}
