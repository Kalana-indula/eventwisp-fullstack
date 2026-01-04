package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Event;
import com.eventwisp.app.entity.Session;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

//Initiate datajpa test
@DataJpaTest

//Configure inmemory db
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class SessionRepositoryTests {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void SessionRepository_FindSessionByEvent_ReturnSessionNotNull(){

        //Arrange
        //Create a test event
        Event event = Event.builder()
                .eventName("TechConference 2025")
                .startingDate(LocalDate.of(2025, 6, 26))
                .description("A conference on modern technology")
                .isCompleted(false)
                .sessions(new ArrayList<>())
                .build();

        //save event
        event = entityManager.persist(event);

        //Create a test session associated with test event
        Session session1=Session.builder()
                .venue("Hall A")
                .date(LocalDate.of(2025, 6, 26))
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(12, 0))
                .event(event).build();

        Session session2=Session.builder()
                .venue("Hall A")
                .date(LocalDate.of(2025, 7, 26))
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(12, 0))
                .event(event).build();

        //save sessions
        sessionRepository.save(session1);
        sessionRepository.save(session2);

        //Act
        List<Session> sessions=sessionRepository.findSessionsByEvent(event.getId());

        //assert
        Assertions.assertThat(sessions).isNotNull();
        Assertions.assertThat(sessions).isNotEmpty();
    }

}
