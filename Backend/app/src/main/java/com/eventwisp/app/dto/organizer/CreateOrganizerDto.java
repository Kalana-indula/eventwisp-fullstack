package com.eventwisp.app.dto.organizer;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateOrganizerDto {
    private String firstName;
    private String lastName;
    private String nic;
    private String companyName;
    private String phone;
    private String email;
    private String password;
}
