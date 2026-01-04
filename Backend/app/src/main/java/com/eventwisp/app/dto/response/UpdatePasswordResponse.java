package com.eventwisp.app.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdatePasswordResponse <T>{
    private Boolean success;
    private String message;
    private T entityData;
}
