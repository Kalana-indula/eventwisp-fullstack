package com.eventwisp.app.dto.admin;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AdminLoginDto {
    private String email;
    private String password;
}
