package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Booking;
import com.eventwisp.app.entity.Event;
import com.eventwisp.app.entity.Session;
import com.eventwisp.app.entity.Ticket;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@DataJpaTest

@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class BookingRepositoryTests {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private BookingRepository bookingRepository;

    @Test
    public void BookingRepository_BookingsByEvent_ReturnBookingsLisNotNull(){
        //Arrange
        //Save a demo event
        Event event = Event.builder()
                .eventName("Tech Summit 2025")
                .startingDate(LocalDate.of(2025, 8, 10))
                .description("Future tech trends")
                .isCompleted(false)
                .build();

        event = entityManager.persist(event);

        //save a demo session
        Session session = Session.builder()
                .venue("Main Hall")
                .date(LocalDate.of(2025, 8, 10))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(13, 0))
                .event(event)
                .build();

        session = entityManager.persist(session);

        //create tickets
        Ticket ticket1 = Ticket.builder()
                .ticketType("General")
                .price(50.0)
                .ticketCount(100)
                .event(event)
                .build();

        Ticket ticket2 = Ticket.builder()
                .ticketType("VIP")
                .price(100.0)
                .ticketCount(50)
                .event(event)
                .build();

        ticket1 = entityManager.persist(ticket1);
        ticket2 = entityManager.persist(ticket2);

        //create a booking
        Booking booking = Booking.builder()
                .bookingId("BKG001")
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .phone("1234567890")
                .idNumber("NIC123456")
                .bookingDate(LocalDate.now())
                .bookingTime(LocalTime.now())
                .ticketCount(2)
                .event(event)
                .session(session)
                .tickets(List.of(ticket1, ticket2))
                .totalPrice(150.0)
                .build();

        booking = entityManager.persist(booking);

        //Act
        List<Booking> bookings=bookingRepository.bookingsByEvent(event.getId());

        //Assert
        Assertions.assertThat(bookings).isNotNull();
        Assertions.assertThat(bookings).isNotEmpty();
    }
}
