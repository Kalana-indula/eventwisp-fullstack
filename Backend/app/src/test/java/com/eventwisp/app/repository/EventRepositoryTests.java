package com.eventwisp.app.repository;

import com.eventwisp.app.entity.Event;
import com.eventwisp.app.entity.EventCategory;
import com.eventwisp.app.entity.EventStatus;
import com.eventwisp.app.entity.Organizer;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class EventRepositoryTests {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private OrganizerRepository organizerRepository;

    @Autowired
    private EventStatusRepository eventStatusRepository;

    @Autowired
    private EventCategoryRepository eventCategoryRepository;

    // ---------- helpers ----------

    private Organizer saveOrganizer(String first, String last, String email) {
        Organizer organizer = Organizer.builder()
                .firstName(first)
                .lastName(last)
                .email(email)
                .password("password123")
                .nic("123456789V")
                .companyName("Eventify")
                .phone("0771234567")
                .activeEventsCount(0) // if your entity has this field
                .build();
        return organizerRepository.save(organizer);
    }

    private EventStatus saveStatus(String statusName) {
        EventStatus status = new EventStatus();
        status.setStatusName(statusName);
        return eventStatusRepository.save(status);
    }

    private EventCategory saveCategory(String categoryName) {
        EventCategory cat = new EventCategory();
        cat.setCategory(categoryName);
        return eventCategoryRepository.save(cat);
    }

    private Event saveEvent(
            String businessId,
            String name,
            Organizer organizer,
            EventStatus status,
            EventCategory category,
            LocalDate startingDate,
            boolean approved,
            boolean published,
            boolean completed
    ) {
        Event e = Event.builder()
                .eventId(businessId)
                .eventName(name)
                .startingDate(startingDate)
                .dateAdded(LocalDate.now())
                .dateCompleted(completed ? startingDate.plusDays(1) : null)
                .coverImageLink("img")
                .description("desc")
                .isApproved(approved)
                .isDisapproved(false)
                .isStarted(false)
                .isCompleted(completed)
                .isPublished(published)
                .earningsByEvent(BigDecimal.ZERO)
                .totalProfit(BigDecimal.ZERO)
                .commission(10.0)
                .totalAttendeesCount(0)
                .eventStatus(status)
                .eventCategory(category)
                .organizer(organizer)
                .build();
        return eventRepository.save(e);
    }

    // ---------- tests ----------

    @Test
    @DisplayName("eventsByOrganizer: returns events only for the given organizer")
    public void EventRepository_FindByOrganizer_ReturnEventNotNull() {
        // Arrange
        Organizer org1 = saveOrganizer("John", "Doe", "john@example.com");
        Organizer org2 = saveOrganizer("Jane", "Smith", "jane@example.com");
        EventStatus status = saveStatus("APPROVED");
        EventCategory cat = saveCategory("TECH");

        saveEvent("EV-001", "Tech Conf A", org1, status, cat, LocalDate.now().plusDays(1), true, true, false);
        saveEvent("EV-002", "Tech Conf B", org1, status, cat, LocalDate.now().plusDays(2), true, false, false);
        saveEvent("EV-003", "Other Org Event", org2, status, cat, LocalDate.now().plusDays(3), true, true, false);

        // Act
        List<Event> events = eventRepository.eventsByOrganizer(org1.getId());

        // Assert
        Assertions.assertThat(events).isNotEmpty();
        Assertions.assertThat(events).hasSize(2);
        Assertions.assertThat(events).extracting(Event::getEventId)
                .containsExactlyInAnyOrder("EV-001", "EV-002");
    }

    @Test
    @DisplayName("findAllOnGoingEvents: returns events with isCompleted=false")
    public void EventRepository_FindAllOnGoingEvents_ReturnsNotCompleted() {
        // Arrange
        Organizer org = saveOrganizer("A", "B", "a@b.com");
        EventStatus status = saveStatus("ONGOING");
        EventCategory cat = saveCategory("BUSINESS");

        saveEvent("EV-010", "Ongoing 1", org, status, cat, LocalDate.now().plusDays(3), true, true, false);
        saveEvent("EV-011", "Ongoing 2", org, status, cat, LocalDate.now().minusDays(1), true, false, false);
        saveEvent("EV-012", "Completed", org, status, cat, LocalDate.now().minusDays(10), true, true, true);

        // Act
        List<Event> res = eventRepository.findAllOnGoingEvents();

        // Assert
        Assertions.assertThat(res).isNotEmpty();
        Assertions.assertThat(res).extracting(Event::getEventId)
                .contains("EV-010", "EV-011")
                .doesNotContain("EV-012");
        Assertions.assertThat(res).allMatch(e -> Boolean.FALSE.equals(e.getIsCompleted()));
    }

    @Test
    @DisplayName("findEventByStatus: returns events by EventStatus ID (Long)")
    public void EventRepository_FindEventByStatus_ReturnsByStatusId() {
        // Arrange
        Organizer org = saveOrganizer("C", "D", "c@d.com");
        EventStatus st1 = saveStatus("APPROVED");
        EventStatus st2 = saveStatus("PENDING");
        EventCategory cat = saveCategory("MUSIC");

        saveEvent("EV-020", "S1 A", org, st1, cat, LocalDate.now().plusDays(2), true, true, false);
        saveEvent("EV-021", "S1 B", org, st1, cat, LocalDate.now().plusDays(5), true, false, false);
        saveEvent("EV-022", "S2 A", org, st2, cat, LocalDate.now().plusDays(7), false, false, false);

        // Act
        List<Event> res = eventRepository.findEventByStatus(st1.getId()); // Long

        // Assert
        Assertions.assertThat(res).hasSize(2);
        Assertions.assertThat(res).extracting(Event::getEventId)
                .containsExactlyInAnyOrder("EV-020", "EV-021");
        Assertions.assertThat(res).allMatch(e -> e.getEventStatus().getId().equals(st1.getId()));
    }

    @Test
    @DisplayName("findOrganizerEventsByStatus: filters by organizer and status")
    public void EventRepository_FindOrganizerEventsByStatus_FiltersByBoth() {
        // Arrange
        Organizer org1 = saveOrganizer("Org", "One", "org1@x.com");
        Organizer org2 = saveOrganizer("Org", "Two", "org2@x.com");
        EventStatus stApproved = saveStatus("APPROVED");
        EventStatus stPending = saveStatus("PENDING");
        EventCategory cat = saveCategory("EDU");

        saveEvent("EV-030", "A1", org1, stApproved, cat, LocalDate.now().plusDays(3), true, true, false);
        saveEvent("EV-031", "P1", org1, stPending,  cat, LocalDate.now().plusDays(4), false, false, false);
        saveEvent("EV-032", "A2", org2, stApproved, cat, LocalDate.now().plusDays(5), true, true, false);

        // Act
        List<Event> res = eventRepository.findOrganizerEventsByStatus(org1.getId(), stApproved.getId()); // Long, Long

        // Assert
        Assertions.assertThat(res).hasSize(1);
        Assertions.assertThat(res.get(0).getEventId()).isEqualTo("EV-030");
        Assertions.assertThat(res.get(0).getOrganizer().getId()).isEqualTo(org1.getId());
        Assertions.assertThat(res.get(0).getEventStatus().getId()).isEqualTo(stApproved.getId());
    }

    @Test
    @DisplayName("findUpComingEventsByCategory: approved+published, date > today, ASC by date")
    public void EventRepository_FindUpComingEventsByCategory_ReturnsFutureApprovedPublished() {
        // Arrange
        Organizer org = saveOrganizer("F", "G", "f@g.com");
        EventStatus st = saveStatus("APPROVED");
        EventCategory catMusic = saveCategory("MUSIC");
        EventCategory catTech  = saveCategory("TECH");

        // Future, approved+published (should match)
        saveEvent("EV-040", "Future 1", org, st, catMusic, LocalDate.now().plusDays(10), true, true, false);
        saveEvent("EV-041", "Future 2", org, st, catMusic, LocalDate.now().plusDays(5),  true, true, false);
        // Future, not published (exclude)
        saveEvent("EV-042", "Future 3", org, st, catMusic, LocalDate.now().plusDays(7),  true, false, false);
        // Past (exclude)
        saveEvent("EV-043", "Past 1",   org, st, catMusic, LocalDate.now().minusDays(1), true, true, false);
        // Different category (exclude)
        saveEvent("EV-044", "Tech Future", org, st, catTech, LocalDate.now().plusDays(8), true, true, false);

        // Act
        List<Event> res = eventRepository.findUpComingEventsByCategory("MUSIC");

        // Assert (ordered ASC by startingDate)
        Assertions.assertThat(res).extracting(Event::getEventId).containsExactly("EV-041", "EV-040");
        Assertions.assertThat(res).allMatch(e ->
                e.getEventCategory().getCategory().equals("MUSIC") &&
                        Boolean.TRUE.equals(e.getIsApproved()) &&
                        Boolean.TRUE.equals(e.getIsPublished()) &&
                        e.getStartingDate().isAfter(LocalDate.now())
        );
    }

    @Test
    @DisplayName("findEventCompletionYearsByOrganizer: returns distinct completion years")
    public void EventRepository_FindEventCompletionYearsByOrganizer_ReturnsDistinctYears() {
        // Arrange
        Organizer org = saveOrganizer("H", "I", "h@i.com");
        EventStatus st = saveStatus("COMPLETED");
        EventCategory cat = saveCategory("SPORTS");

        // completed 2023
        Event e2023 = saveEvent("EV-050", "Y2023", org, st, cat, LocalDate.of(2023, 5, 1), true, true, true);
        e2023.setDateCompleted(LocalDate.of(2023, 5, 2));
        eventRepository.save(e2023);

        // completed 2024 (two events)
        Event e2024a = saveEvent("EV-051", "Y2024 A", org, st, cat, LocalDate.of(2024, 6, 1), true, true, true);
        e2024a.setDateCompleted(LocalDate.of(2024, 6, 2));
        eventRepository.save(e2024a);

        Event e2024b = saveEvent("EV-052", "Y2024 B", org, st, cat, LocalDate.of(2024, 7, 1), true, true, true);
        e2024b.setDateCompleted(LocalDate.of(2024, 7, 3));
        eventRepository.save(e2024b);

        // not completed (exclude)
        saveEvent("EV-053", "NotCompleted", org, st, cat, LocalDate.of(2025, 1, 1), true, true, false);

        // Act
        List<Integer> years = eventRepository.findEventCompletionYearsByOrganizer(org.getId());

        // Assert
        Assertions.assertThat(years).containsExactlyInAnyOrder(2023, 2024);
    }

    @Test
    @DisplayName("findByEventId: returns event by business eventId")
    public void EventRepository_FindByEventId_ReturnsOne() {
        // Arrange
        Organizer org = saveOrganizer("J", "K", "j@k.com");
        EventStatus st = saveStatus("APPROVED");
        EventCategory cat = saveCategory("EXPO");

        saveEvent("EVT-999", "Expo Main", org, st, cat, LocalDate.now().plusDays(15), true, true, false);
        saveEvent("EVT-1000", "Expo Side", org, st, cat, LocalDate.now().plusDays(16), true, false, false);

        // Act
        Event found = eventRepository.findByEventId("EVT-999");

        // Assert
        Assertions.assertThat(found).isNotNull();
        Assertions.assertThat(found.getEventName()).isEqualTo("Expo Main");
        Assertions.assertThat(found.getEventId()).isEqualTo("EVT-999");
    }
}
