package com.eventwisp.app.dto.response.general;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SingleEntityResponse<T> {
    private String message;
    private T entityData;
}
