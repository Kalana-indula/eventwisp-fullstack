package com.eventwisp.app.dto.response.general;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class MultipleEntityResponse<T> {
    private String message;
    private String remarks="";
    private List<T> entityList = new ArrayList<>();
}
