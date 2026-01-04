package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Bank;
import com.eventwisp.app.entity.Organizer;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class BankRepositoryTests {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private BankRepository bankRepository;

    @Test
    public void BankRepository_FindByOrganizer_ReturnsBankNotNull() {
        // Arrange: persist an Organizer
        Organizer organizer = new Organizer();
        organizer.setFirstName("Kalana");
        organizer.setLastName("Indula");
        organizer = entityManager.persist(organizer);

        // Arrange: persist a Bank linked to the Organizer
        Bank bank = Bank.builder()
                .bankName("Commercial Bank")
                .accountHolderName("Kalana Indula")
                .branchName("Colombo Main")
                .accountNumber("1234567890")
                .organizer(organizer)
                .build();
        entityManager.persist(bank);

        // Act
        Bank fetched = bankRepository.findByOrganizer(organizer.getId());

        // Assert
        Assertions.assertThat(fetched).isNotNull();
        Assertions.assertThat(fetched.getId()).isNotNull();
        Assertions.assertThat(fetched.getBankName()).isEqualTo("Commercial Bank");
        Assertions.assertThat(fetched.getOrganizer()).isNotNull();
        Assertions.assertThat(fetched.getOrganizer().getId()).isEqualTo(organizer.getId());
    }

    @Test
    public void BankRepository_FindByOrganizer_ReturnsNullWhenNotFound() {
        // Act
        Bank result = bankRepository.findByOrganizer(999L);

        // Assert
        Assertions.assertThat(result).isNull();
    }
}
