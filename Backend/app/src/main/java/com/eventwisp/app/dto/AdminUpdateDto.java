package com.eventwisp.app.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AdminUpdateDto {

    private String phone;
    private String email;
    private String password;
}
