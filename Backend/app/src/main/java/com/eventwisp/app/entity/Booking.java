package com.eventwisp.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Setter
@Getter
@Table(name = "booking")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "booking_id")
    private String bookingId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    //Identification document number (NIC/ Passport/Driving license)
    @Column(name = "id_number")
    private String idNumber;

    @Column(name = "booking_data")
    private LocalDate bookingDate;

    @Column(name = "booking_time")
    private LocalTime bookingTime;

    @Column(name = "ticket_count")
    private Integer ticketCount;

    //ticket issued data
    @Column(name = "ticket_issued")
    private Boolean ticketIssued=false;

    //get ticket issued date
    @Column(name = "ticket_issued_date")
    private LocalDate ticketIssuedDate;

    @Column(name = "ticket_issued_time")
    private LocalTime ticketIssuedTime;

    //session
    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;

    //Event
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    //Forming a Many-to-Many relationship with Tickets
    @ManyToMany
    @JoinTable(
            name = "booking_ticket",
            joinColumns = @JoinColumn(name = "booking_id"),
            inverseJoinColumns = @JoinColumn(name = "ticket_id")
    )
    private List<Ticket> tickets;

    //total cost of booking
    @Column(name = "total_price")
    private Double totalPrice;
}
