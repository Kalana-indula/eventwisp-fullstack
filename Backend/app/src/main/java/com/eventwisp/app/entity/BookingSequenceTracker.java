package com.eventwisp.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "booking_sequence_tracker")
@Getter
@Setter
public class BookingSequenceTracker {

    @Id
    @Column(name = "id")
    private String date;

    @Column(name = "sequence")
    private Long sequence;

}
