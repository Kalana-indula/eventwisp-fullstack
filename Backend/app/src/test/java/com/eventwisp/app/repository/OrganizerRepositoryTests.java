package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Organizer;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class OrganizerRepositoryTests {

    @Autowired
    private OrganizerRepository organizerRepository;

    // ---------- helpers ----------
    private Organizer saveOrganizer(
            String organizerId,
            String firstName,
            String lastName,
            String email,
            boolean pendingApproval,
            boolean approved,
            boolean disapproved
    ) {
        Organizer o = Organizer.builder()
                .organizerId(organizerId)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password("secret")
                .nic("123456789V")
                .companyName("Eventify")
                .phone("0771234567")
                .pendingApproval(pendingApproval)
                .isApproved(approved)
                .isDisapproved(disapproved)
                .totalEarnings(BigDecimal.ZERO)
                .totalWithdrawals(BigDecimal.ZERO)
                .currentBalance(BigDecimal.ZERO)
                .activeEventsCount(0)
                .build();
        return organizerRepository.save(o);
    }

    // ---------- tests ----------

    @Test
    @DisplayName("findOrganizerByOrganizerId: returns the matching organizer")
    public void OrganizerRepository_FindByOrganizerId_ReturnsOrganizer() {
        // Arrange
        saveOrganizer("ORG-001", "John", "Doe", "john@example.com", true, false, false);
        saveOrganizer("ORG-002", "Jane", "Smith", "jane@example.com", false, true, false);

        // Act
        Organizer found = organizerRepository.findOrganizerByOrganizerId("ORG-002");

        // Assert
        Assertions.assertThat(found).isNotNull();
        Assertions.assertThat(found.getOrganizerId()).isEqualTo("ORG-002");
        Assertions.assertThat(found.getEmail()).isEqualTo("jane@example.com");
    }

    @Test
    @DisplayName("findOrganizerByOrganizerId: returns null when not found")
    public void OrganizerRepository_FindByOrganizerId_ReturnsNullWhenNotFound() {
        // Arrange
        saveOrganizer("ORG-003", "Alex", "Brown", "alex@example.com", true, false, false);

        // Act
        Organizer notFound = organizerRepository.findOrganizerByOrganizerId("NOPE-999");

        // Assert
        Assertions.assertThat(notFound).isNull();
    }

    @Test
    @DisplayName("pendingOrganizers: returns organizers with pendingApproval=true")
    public void OrganizerRepository_PendingOrganizers_ReturnsOnlyPending() {
        // Arrange
        saveOrganizer("ORG-010", "Pera", "Ran", "p1@example.com", true, false, false);   // pending
        saveOrganizer("ORG-011", "Mira", "Jay", "p2@example.com", true, false, false);   // pending
        saveOrganizer("ORG-012", "Nila", "Dee", "a1@example.com", false, true, false);   // approved
        saveOrganizer("ORG-013", "Kavi", "Per", "d1@example.com", false, false, true);   // disapproved

        // Act
        List<Organizer> pending = organizerRepository.pendingOrganizers();

        // Assert
        Assertions.assertThat(pending).isNotEmpty();
        Assertions.assertThat(pending).allMatch(o -> Boolean.TRUE.equals(o.getPendingApproval()));
        Assertions.assertThat(pending).extracting(Organizer::getOrganizerId)
                .containsExactlyInAnyOrder("ORG-010", "ORG-011");
    }

    @Test
    @DisplayName("approvedOrganizers: returns organizers with isApproved=true")
    public void OrganizerRepository_ApprovedOrganizers_ReturnsOnlyApproved() {
        // Arrange
        saveOrganizer("ORG-020", "A", "One", "a1@example.com", false, true, false);     // approved
        saveOrganizer("ORG-021", "A", "Two", "a2@example.com", false, true, false);     // approved
        saveOrganizer("ORG-022", "P", "One", "p1@example.com", true, false, false);     // pending
        saveOrganizer("ORG-023", "D", "One", "d1@example.com", false, false, true);     // disapproved

        // Act
        List<Organizer> approved = organizerRepository.approvedOrganizers();

        // Assert
        Assertions.assertThat(approved).hasSize(2);
        Assertions.assertThat(approved).allMatch(o -> Boolean.TRUE.equals(o.getIsApproved()));
        Assertions.assertThat(approved).extracting(Organizer::getOrganizerId)
                .containsExactlyInAnyOrder("ORG-020", "ORG-021");
    }

    @Test
    @DisplayName("disapprovedOrganizers: returns organizers with isDisapproved=true")
    public void OrganizerRepository_DisapprovedOrganizers_ReturnsOnlyDisapproved() {
        // Arrange
        saveOrganizer("ORG-030", "D", "One", "d1@example.com", false, false, true);     // disapproved
        saveOrganizer("ORG-031", "D", "Two", "d2@example.com", false, false, true);     // disapproved
        saveOrganizer("ORG-032", "P", "One", "p1@example.com", true, false, false);     // pending
        saveOrganizer("ORG-033", "A", "One", "a1@example.com", false, true, false);     // approved

        // Act
        List<Organizer> disapproved = organizerRepository.disapprovedOrganizers();

        // Assert
        Assertions.assertThat(disapproved).hasSize(2);
        Assertions.assertThat(disapproved).allMatch(o -> Boolean.TRUE.equals(o.getIsDisapproved()));
        Assertions.assertThat(disapproved).extracting(Organizer::getOrganizerId)
                .containsExactlyInAnyOrder("ORG-030", "ORG-031");
    }
}
