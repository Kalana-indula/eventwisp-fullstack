package com.eventwisp.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "session")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "session_number")
    private String sessionNumber;

    @Column(name = "venue")
    private String venue;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "attendees")
    private Integer attendees=0;

    @Column(name = "revenue")
    private BigDecimal revenue=BigDecimal.ZERO;

    @Column(name = "profit")
    private BigDecimal profit=BigDecimal.ZERO;

    //Event
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    //bookings
    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL,mappedBy = "session")
    private List<Booking> bookings;

    //map an independent
    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.ALL,mappedBy = "session")
    private List<SessionTicket> sessionTicketDetails;
}