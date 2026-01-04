package com.eventwisp.app.dto.response.general;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateResponse<T> {
    private T updatedData;
    private String message;
}
