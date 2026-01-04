package com.eventwisp.app.repository;

import com.eventwisp.app.entity.MonthlyEarning;
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
public class MonthlyEarningRepositoryTests {

    @Autowired
    private MonthlyEarningRepository monthlyEarningRepository;

    @Autowired
    private OrganizerRepository organizerRepository;

    // ---------- helpers ----------

    private Organizer saveOrganizer(String firstName, String lastName, String email) {
        Organizer organizer = Organizer.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password("password123")
                .nic("123456789V")
                .companyName("Eventify")
                .phone("0771234567")
                .activeEventsCount(0)
                .build();
        return organizerRepository.save(organizer);
    }

    private MonthlyEarning saveMonthlyEarning(Organizer organizer, int monthNumber, String monthName, int year, BigDecimal amount) {
        MonthlyEarning earning = MonthlyEarning.builder()
                .monthNumber(monthNumber)
                .monthName(monthName)
                .year(year)
                .totalEarnings(amount)
                .organizer(organizer)
                .build();
        return monthlyEarningRepository.save(earning);
    }

    // ---------- tests ----------

    @Test
    @DisplayName("findByOrganizerAndYear: returns monthly earnings for given organizer and year")
    public void MonthlyEarningRepository_FindByOrganizerAndYear_ReturnsList() {
        // Arrange
        Organizer org1 = saveOrganizer("John", "Doe", "john@example.com");
        Organizer org2 = saveOrganizer("Jane", "Smith", "jane@example.com");

        saveMonthlyEarning(org1, 1, "January", 2024, BigDecimal.valueOf(5000));
        saveMonthlyEarning(org1, 2, "February", 2024, BigDecimal.valueOf(3000));
        saveMonthlyEarning(org1, 3, "March", 2023, BigDecimal.valueOf(2000)); // different year
        saveMonthlyEarning(org2, 1, "January", 2024, BigDecimal.valueOf(1000)); // different organizer

        // Act
        List<MonthlyEarning> results = monthlyEarningRepository.findByOrganizerAndYear(org1.getId(), 2024);

        // Assert
        Assertions.assertThat(results).isNotEmpty();
        Assertions.assertThat(results).hasSize(2);
        Assertions.assertThat(results).allMatch(e ->
                e.getOrganizer().getId().equals(org1.getId()) && e.getYear() == 2024);
        Assertions.assertThat(results).extracting(MonthlyEarning::getMonthName)
                .containsExactlyInAnyOrder("January", "February");
    }

    @Test
    @DisplayName("findAllYears: returns distinct years in descending order")
    public void MonthlyEarningRepository_FindAllYears_ReturnsDistinctSortedYears() {
        // Arrange
        Organizer org = saveOrganizer("Alex", "Brown", "alex@example.com");
        saveMonthlyEarning(org, 1, "January", 2023, BigDecimal.valueOf(2000));
        saveMonthlyEarning(org, 2, "February", 2024, BigDecimal.valueOf(3000));
        saveMonthlyEarning(org, 3, "March", 2025, BigDecimal.valueOf(4000));
        saveMonthlyEarning(org, 4, "April", 2024, BigDecimal.valueOf(1000)); // duplicate year

        // Act
        List<Integer> years = monthlyEarningRepository.findAllYears();

        // Assert
        Assertions.assertThat(years).isNotEmpty();
        Assertions.assertThat(years).containsExactly(2025, 2024, 2023);
    }

    @Test
    @DisplayName("findMonthlyEarningsByYear: returns all earnings for a given year")
    public void MonthlyEarningRepository_FindMonthlyEarningsByYear_ReturnsList() {
        // Arrange
        Organizer org1 = saveOrganizer("Lisa", "Fernando", "lisa@example.com");
        Organizer org2 = saveOrganizer("Kevin", "Jay", "kevin@example.com");

        saveMonthlyEarning(org1, 5, "May", 2024, BigDecimal.valueOf(1500));
        saveMonthlyEarning(org2, 6, "June", 2024, BigDecimal.valueOf(2500));
        saveMonthlyEarning(org1, 7, "July", 2023, BigDecimal.valueOf(1800)); // different year

        // Act
        List<MonthlyEarning> results = monthlyEarningRepository.findMonthlyEarningsByYear(2024);

        // Assert
        Assertions.assertThat(results).isNotEmpty();
        Assertions.assertThat(results).hasSize(2);
        Assertions.assertThat(results).allMatch(e -> e.getYear() == 2024);
        Assertions.assertThat(results).extracting(MonthlyEarning::getMonthName)
                .containsExactlyInAnyOrder("May", "June");
    }

    @Test
    @DisplayName("findByOrganizerAndYear: returns empty list when no records match")
    public void MonthlyEarningRepository_FindByOrganizerAndYear_ReturnsEmptyList() {
        // Arrange
        Organizer org = saveOrganizer("No", "Data", "nodata@example.com");
        saveMonthlyEarning(org, 1, "January", 2022, BigDecimal.valueOf(1000));

        // Act
        List<MonthlyEarning> results = monthlyEarningRepository.findByOrganizerAndYear(org.getId(), 2025);

        // Assert
        Assertions.assertThat(results).isEmpty();
    }
}
