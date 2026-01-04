package com.eventwisp.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "session_ticket")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SessionTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "ticket_id")
    private Long ticketId;

    @Column(name = "ticket_type")
    private String ticketType;

    @Column(name = "ticket_price")
    private Double ticketPrice;

    @Column(name = "initial_ticket_count")
    private Integer initialTicketCount;

    @Column(name = "remaining_ticket_count")
    private Integer remainingTicketCount;

    @Column(name = "sold_ticket_count")
    private Integer soldTicketCount;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;
}
