package com.eventwisp.app.controller;

import com.eventwisp.app.dto.finance.CommissionUpdate;
import com.eventwisp.app.dto.finance.UpdateBalance;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.entity.FinancialData;
import com.eventwisp.app.service.FinancialDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class FinancialDataController {

    private FinancialDataService financialDataService;

    @Autowired
    public FinancialDataController(FinancialDataService financialDataService) {
        this.financialDataService = financialDataService;
    }

    @PostMapping("/financial-data")
    ResponseEntity<?> addInitialData(@RequestBody FinancialData financialData) {
        try{
            FinancialData data=financialDataService.addInitialData(financialData);

            return ResponseEntity.status(HttpStatus.OK).body(data);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/commission")
    ResponseEntity<?> getCommission() {
        try {
            SingleEntityResponse<Double> response = financialDataService.getCommission();

            if (response.getEntityData()==null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/platform-balance")
    ResponseEntity<?> getBalance() {
        try {
            SingleEntityResponse<BigDecimal> response = financialDataService.getBalance();

            if(response.getEntityData()==null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/commission")
    ResponseEntity<?> updateCommission(@RequestBody CommissionUpdate commissionUpdate) {
        try {
            SingleEntityResponse<Double> response = financialDataService.updateCommission(commissionUpdate);

            if (response.getEntityData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/platform-balance")
    ResponseEntity<?> updateBalance(@RequestBody UpdateBalance updateBalance) {
        try {
            SingleEntityResponse<BigDecimal> response = financialDataService.updateBalance(updateBalance);

            if (response.getEntityData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
