package com.eventwisp.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "event")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id")
    private String eventId;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "starting_date")
    private LocalDate startingDate;

    @Column(name = "date_added")
    private LocalDate dateAdded;

    @Column(name = "date_completed")
    private LocalDate dateCompleted;

    @Column(name = "cover_image_link")
    private String coverImageLink;

    //mark this field as it accepts large text objects
    @Lob
    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    @Column(name="is_approved")
    private Boolean isApproved=false;

    @Column(name = "is_disapproved")
    private Boolean isDisapproved=false;

    @Column(name = "is_started")
    private Boolean isStarted=false;

    //Make sure, that 'isCompleted' is false by default
    @Column(name = "is_completed")
    private Boolean isCompleted=false;

    @Column(name = "is_published")
    private Boolean isPublished=false;

    @Column(name = "earnings_by_event")
    private BigDecimal earningsByEvent=BigDecimal.ZERO;

    @Column(name = "total_profit")
    private BigDecimal totalProfit=BigDecimal.ZERO;

    @Column(name = "commission")
    private Double commission;

    @Column(name = "total_attendees_count")
    private Integer totalAttendeesCount=0;

    //Create a column for foriegn key
    @ManyToOne
    @JoinColumn(name = "event_category_id")
    private EventCategory eventCategory;

    @ManyToOne
    @JoinColumn(name = "event_status_id")
    private EventStatus eventStatus;

    //Organizer
    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private Organizer organizer;

    //"mappedBy" attribute is used by the inverse side of the class
    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL,mappedBy = "event")
    private List<Ticket> tickets;

    //sessions
    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL,mappedBy = "event")
    private List<Session> sessions;

    //bookings
    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL,mappedBy = "event")
    private List<Booking> bookings;
}