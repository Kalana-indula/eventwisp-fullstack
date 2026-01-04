package com.eventwisp.app.service;

import com.eventwisp.app.dto.response.FindSessionByEventResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.sessionDto.CreateSessionDto;
import com.eventwisp.app.dto.sessionDto.SessionCardDto;
import com.eventwisp.app.dto.sessionDto.SessionDetailsDto;
import com.eventwisp.app.dto.sessionDto.SessionUpdateDto;
import com.eventwisp.app.entity.Session;
import org.springframework.stereotype.Service;

@Service
public interface SessionService {

    Session createSession(CreateSessionDto createSessionDto);

    MultipleEntityResponse<SessionCardDto> findAllSessions();

    //find session by id
    SingleEntityResponse<SessionCardDto> findSessionById(Long sessionId);

    FindSessionByEventResponse findSessionsByEvent(Long eventId);

    Session updateSession(Long id,SessionUpdateDto sessionUpdateDto);

    Boolean deleteSession(Long id);

    //find up coming sessions
    MultipleEntityResponse<SessionCardDto> findUpcomingSessions(String categoryName);

    //find the sessions list descending ordered by date added
    MultipleEntityResponse<SessionCardDto> findLatestSessions();

    //get session details by id
    SingleEntityResponse<SessionDetailsDto> findSessionDetailsBySessionId(Long sessionId);

    //find session by event name
    MultipleEntityResponse<SessionCardDto> findSessionsByEventName(String eventName);
}
