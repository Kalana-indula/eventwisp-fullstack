package com.eventwisp.app.repository;

import com.eventwisp.app.entity.TransactionsTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionTrackerRepository extends JpaRepository<TransactionsTracker,String> {
}
