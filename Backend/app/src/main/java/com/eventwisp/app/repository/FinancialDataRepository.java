package com.eventwisp.app.repository;

import com.eventwisp.app.entity.FinancialData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinancialDataRepository extends JpaRepository<FinancialData, Integer> {
}
