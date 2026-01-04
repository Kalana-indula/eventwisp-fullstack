package com.eventwisp.app.controller;

import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.entity.SystemBank;
import com.eventwisp.app.service.SystemBankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class SystemBankController {

    private final SystemBankService systemBankService;

    @Autowired
    public SystemBankController(SystemBankService systemBankService) {
        this.systemBankService = systemBankService;
    }

    //add a new bank
    @PostMapping("/system-banks")
    public ResponseEntity<?> addSystemBank(@RequestBody SystemBank systemBank) {
        try {
            SystemBank saved = systemBankService.addSystemBank(systemBank);

            return ResponseEntity.status(HttpStatus.OK).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //get bank details
    @GetMapping("/system-banks")
    public ResponseEntity<?> getAllSystemBankDetails() {
        try {
            SingleEntityResponse<SystemBank> response = systemBankService.getAllSystemBankDetails();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //update bank
    @PutMapping("/system-banks")
    public ResponseEntity<?> updateSystemBank(@RequestBody SystemBank systemBank) {
        try {
            SingleEntityResponse<SystemBank> response = systemBankService.updateSystemBankDetails(systemBank);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
