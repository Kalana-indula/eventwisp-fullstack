package com.eventwisp.app.dto.updateData;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdatePasswordDto {
    private String currentPassword;
    private String newPassword;
}
