package com.eventwisp.app.controller;

import com.eventwisp.app.dto.bank.AddBankDto;
import com.eventwisp.app.dto.bank.BankDetailsDto;
import com.eventwisp.app.dto.bank.UpdateBankDto;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.service.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BankController {

    private BankService bankService;

    @Autowired
    public BankController(BankService bankService) {
        this.bankService = bankService;
    }

    @PostMapping("/organizers/banks")
    public ResponseEntity<?> addOrganizerBankDetails(@RequestBody AddBankDto addBankDto) {
        try {
            SingleEntityResponse<BankDetailsDto> response = bankService.addBank(addBankDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding bank details: " + e.getMessage());
        }
    }

    @GetMapping("/organizers/{organizerId}/banks")
    public ResponseEntity<?> findBankByOrganizer(@PathVariable Long organizerId) {
        try {
            SingleEntityResponse<BankDetailsDto> response = bankService.findBankByOrganizer(organizerId);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving bank details: " + e.getMessage());
        }
    }

    @PutMapping("/organizers/{organizerId}/banks")
    public ResponseEntity<?> updateBankDetails(@PathVariable Long organizerId, @RequestBody UpdateBankDto updateBankDto) {
        try {
            SingleEntityResponse<BankDetailsDto> response = bankService.findBankByBankId(organizerId, updateBankDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating bank details: " + e.getMessage());
        }
    }
}
