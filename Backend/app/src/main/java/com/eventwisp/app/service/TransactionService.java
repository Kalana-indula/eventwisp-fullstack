package com.eventwisp.app.service;

import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.transaction.CreateTransactionRequest;
import com.eventwisp.app.dto.transaction.TransactionDetails;
import org.springframework.stereotype.Service;

@Service
public interface TransactionService {

    //create a new transaction
    SingleEntityResponse<TransactionDetails> createTransaction(CreateTransactionRequest createTransactionRequest);

    //get all transactions
    MultipleEntityResponse<TransactionDetails> getAllTransactions();

    //find transactions by id
    SingleEntityResponse<TransactionDetails> findTransactionById(Long id);

    //find transaction by generated transaction id
    SingleEntityResponse<TransactionDetails> findTransactionByTransactionId(String transactionId);

    //find transactions by organizer
    MultipleEntityResponse<TransactionDetails> findTransactionsByOrganizer(Long organizerId);

}
