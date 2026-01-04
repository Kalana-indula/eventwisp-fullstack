package com.eventwisp.app.dto.accountActions;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DeleteUserDto {
    private String email;
    private String password;
}

