package com.eventwisp.app.controller;

import com.eventwisp.app.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins ="*")
public class PasswordResetController {

    private PasswordResetService passwordResetService;

    @Autowired
    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot")
    public ResponseEntity<?> forgot(@RequestBody Map<String,String> body) {
        passwordResetService.requestReset(body.get("email"));
        return ResponseEntity.ok(Map.of("message","If that email exists, a reset link was sent."));
    }

    @PostMapping("/reset/validate")
    public ResponseEntity<?> validate(@RequestBody Map<String,String> body) {
        boolean valid = passwordResetService.validateToken(body.get("token"));
        return ResponseEntity.ok(Map.of("valid", valid));
    }

    @PostMapping("/reset/confirm")
    public ResponseEntity<?> confirm(@RequestBody Map<String,String> body) {
        passwordResetService.resetPassword(body.get("token"), body.get("newPassword"));
        return ResponseEntity.ok(Map.of("message","Password updated"));
    }
}
