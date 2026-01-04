package com.eventwisp.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Setter
@Getter
@Table(name = "monthly_earnings")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MonthlyEarning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "month_number")
    private Integer monthNumber;

    @Column(name = "month_name")
    private String monthName;

    @Column(name = "year")
    private Integer year;

    @Column(name = "total_earnings")
    private BigDecimal totalEarnings=BigDecimal.ZERO;

    @ManyToOne
    @JoinColumn(name = "organizer_id",referencedColumnName = "id")
    private Organizer organizer;
}
