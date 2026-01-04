package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BankRepository extends JpaRepository<Bank, Long> {

    //find bank details by organizer
    @Query("SELECT b FROM Bank b WHERE b.organizer.id = :organizerId")
    Bank findByOrganizer(@Param("organizerId") Long organizerId);

}
