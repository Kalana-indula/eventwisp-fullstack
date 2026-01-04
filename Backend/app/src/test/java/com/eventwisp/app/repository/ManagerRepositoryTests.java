package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Manager;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ManagerRepositoryTests {

    @Autowired
    private ManagerRepository managerRepository;

    @Test
    @DisplayName("findAssignedManager: returns the manager with isAssigned=true")
    public void ManagerRepository_FindAssignedManager_ReturnsAssigned() {
        // Arrange: two unassigned
        Manager m1 = Manager.builder()
                .firstName("Alice")
                .lastName("Perera")
                .nic("901234567V")
                .phone("0771000001")
                .email("alice@example.com")
                .password("pw1")
                .isAssigned(false)
                .statusUpdateDate(LocalDate.now().minusDays(2))
                .build();
        managerRepository.save(m1);

        Manager m2 = Manager.builder()
                .firstName("Bob")
                .lastName("Silva")
                .nic("911234567V")
                .phone("0771000002")
                .email("bob@example.com")
                .password("pw2")
                .isAssigned(false)
                .statusUpdateDate(LocalDate.now().minusDays(1))
                .build();
        managerRepository.save(m2);

        // Arrange: one assigned
        Manager assigned = Manager.builder()
                .firstName("Charlie")
                .lastName("Fernando")
                .nic("921234567V")
                .phone("0771000003")
                .email("charlie@example.com")
                .password("pw3")
                .isAssigned(true)
                .statusUpdateDate(LocalDate.now())
                .build();
        managerRepository.save(assigned);

        // Act
        Manager result = managerRepository.findAssignedManager();

        // Assert
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getEmail()).isEqualTo("charlie@example.com");
        Assertions.assertThat(result.getIsAssigned()).isTrue();
    }

    @Test
    @DisplayName("findAssignedManager: returns null when no manager is assigned")
    public void ManagerRepository_FindAssignedManager_ReturnsNullWhenNone() {
        // Arrange: only unassigned managers
        Manager m1 = Manager.builder()
                .firstName("Dilan")
                .lastName("Jay")
                .nic("931234567V")
                .phone("0771000004")
                .email("dilan@example.com")
                .password("pw4")
                .isAssigned(false)
                .statusUpdateDate(LocalDate.now())
                .build();
        managerRepository.save(m1);

        Manager m2 = Manager.builder()
                .firstName("Ema")
                .lastName("Dias")
                .nic("941234567V")
                .phone("0771000005")
                .email("ema@example.com")
                .password("pw5")
                .isAssigned(false)
                .statusUpdateDate(LocalDate.now())
                .build();
        managerRepository.save(m2);

        // Act
        Manager result = managerRepository.findAssignedManager();

        // Assert
        Assertions.assertThat(result).isNull();
    }
}
