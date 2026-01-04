package com.eventwisp.app.repository;

import com.eventwisp.app.entity.MonthlyEarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonthlyEarningRepository extends JpaRepository<MonthlyEarning, Long> {

    //get monthly earnings sorted by organizer and year
    @Query("SELECT me FROM MonthlyEarning me WHERE me.organizer.id = :organizerId AND me.year = :year")
    List<MonthlyEarning> findByOrganizerAndYear(@Param("organizerId") Long organizerId, @Param("year") Integer year);

    // return distinct years, newest first
    @Query("SELECT DISTINCT me.year FROM MonthlyEarning me ORDER BY me.year DESC")
    List<Integer> findAllYears();

    //get monthly earnings by year
    @Query("SELECT me FROM MonthlyEarning me WHERE me.year = :year")
    List<MonthlyEarning> findMonthlyEarningsByYear(@Param("year") Integer year);
    
}
