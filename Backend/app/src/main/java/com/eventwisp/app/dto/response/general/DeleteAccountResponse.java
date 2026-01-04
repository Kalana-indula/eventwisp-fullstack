package com.eventwisp.app.dto.response.general;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DeleteAccountResponse {
    private Boolean success;
    private String message;
}
