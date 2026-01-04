package com.eventwisp.app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "event_sequence_tracker")
@Setter
@Getter
public class EventSequenceTracker {

    @Id
    @Column(name = "id")
    private String date;

    @Column(name = "sequence")
    private Long sequence;
}
