package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long > {

    List<Transaction> findByOrganizerId(Long organizerId);

    //find transactions by transaction id
    Optional<Transaction> findByTransactionId(String transactionId);
}
