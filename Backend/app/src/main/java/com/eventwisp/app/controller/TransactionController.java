package com.eventwisp.app.controller;

import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.transaction.CreateTransactionRequest;
import com.eventwisp.app.dto.transaction.TransactionDetails;
import com.eventwisp.app.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class TransactionController {

    private TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    //create a transaction
    @PostMapping("/transactions")
    public ResponseEntity<?> createTransaction(@RequestBody CreateTransactionRequest createTransactionRequest) {
        try{
            SingleEntityResponse<TransactionDetails> response=transactionService.createTransaction(createTransactionRequest);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getAllTransactions() {
        try {
            MultipleEntityResponse<TransactionDetails> response = transactionService.getAllTransactions();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // Get transaction by ID
    @GetMapping("/transactions/{id}")
    public ResponseEntity<?> findTransactionById(@PathVariable Long id) {
        try {
            SingleEntityResponse<TransactionDetails> response = transactionService.findTransactionById(id);

            // Check if transaction was found
            if (response.getEntityData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find transaction by transaction id
    @GetMapping("/transactions/id/{transactionId}")
    public ResponseEntity<?> findTransactionByTransactionId(@PathVariable String transactionId) {
        try {
            SingleEntityResponse<TransactionDetails> response = transactionService.findTransactionByTransactionId(transactionId);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/organizers/{organizerId}/transactions")
    public ResponseEntity<?> findTransactionsByOrganizer(@PathVariable Long organizerId) {
        try {
            MultipleEntityResponse<TransactionDetails> response = transactionService.findTransactionsByOrganizer(organizerId);

            // Check if any transactions were found
            if (response.getEntityList().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
