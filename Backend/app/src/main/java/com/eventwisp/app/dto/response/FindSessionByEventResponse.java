package com.eventwisp.app.dto.response;

import com.eventwisp.app.dto.sessionDto.SessionDetailsDto;
import lombok.Getter;
import lombok.Setter;

import java.util.Collections;
import java.util.List;

@Setter
@Getter
public class FindSessionByEventResponse {
    private String message;
    private List<SessionDetailsDto> sessionList= Collections.emptyList();
}
