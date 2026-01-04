package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Event;
import com.eventwisp.app.entity.Ticket;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@DataJpaTest

@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class TicketRepositoryTests {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void TicketRepository_FindByEvent_ReturnTicketNotNull() {

        //Arrange
        Event event = Event.builder()
                .eventName("TechConference 2025")
                .startingDate(LocalDate.of(2025, 6, 26))
                .description("A conference on modern technology")
                .isCompleted(false)
                .tickets(new ArrayList<>())
                .build();

        //save the event
        event = entityManager.persist(event);

        Ticket ticket1 = Ticket.builder()
                .ticketType("VIP")
                .price(100.00)
                .ticketCount(50)
                .event(event)
                .build();

        Ticket ticket2 = Ticket.builder()
                .ticketType("Regular")
                .price(50.00)
                .ticketCount(100)
                .event(event)
                .build();
        ticketRepository.save(ticket1);
        ticketRepository.save(ticket2);

        //act
        List<Ticket> tickets=ticketRepository.findTicketsByEvent(event.getId());

        //Assert
        Assertions.assertThat(tickets).isNotNull();
        Assertions.assertThat(tickets).isNotEmpty();

    }
}
