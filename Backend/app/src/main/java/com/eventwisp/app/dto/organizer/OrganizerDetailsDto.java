package com.eventwisp.app.dto.organizer;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class OrganizerDetailsDto {
    private Long id;
    private String organizerId;
    private String name;
    private String nic;
    private String companyName;
    private String email;
    private String phone;
    private Boolean pendingApproval;
    private Boolean isApproved;
    private Boolean isDisapproved;
    private BigDecimal totalEarnings;
    private BigDecimal totalWithdrawals;
    private BigDecimal currentBalance;
    private Integer activeEventsCount;
}
