package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Organizer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizerRepository extends JpaRepository<Organizer,Long> {

    //find an organizer by email
    Optional<Organizer> findByEmail(String email);

    //Check if a user exists by email
    Boolean existsByEmail(String email);

    //find by organizer id
    @Query("SELECT o FROM Organizer o WHERE o.organizerId = :organizerId")
    Organizer findOrganizerByOrganizerId(@Param("organizerId") String organizerId);

    //find pending approval organizer accounts
    @Query("SELECT o FROM Organizer o WHERE o.pendingApproval = true")
    List<Organizer> pendingOrganizers();

    //find approved organizers
    @Query("SELECT o FROM Organizer o WHERE o.isApproved = true")
    List<Organizer> approvedOrganizers();

    //find disapprove organizers
    @Query("SELECT o FROM Organizer o WHERE o.isDisapproved = true")
    List<Organizer> disapprovedOrganizers();
}
