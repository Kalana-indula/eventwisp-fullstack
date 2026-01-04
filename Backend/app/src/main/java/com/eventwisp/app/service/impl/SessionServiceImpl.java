package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.response.FindSessionByEventResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.sessionDto.CreateSessionDto;
import com.eventwisp.app.dto.sessionDto.SessionCardDto;
import com.eventwisp.app.dto.sessionDto.SessionDetailsDto;
import com.eventwisp.app.dto.sessionDto.SessionUpdateDto;
import com.eventwisp.app.entity.*;
import com.eventwisp.app.repository.*;
import com.eventwisp.app.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SessionServiceImpl implements SessionService {

    //Create an instance of sessionRepository and eventRepository
    private SessionRepository sessionRepository;

    private EventRepository eventRepository;

    private EventCategoryRepository eventCategoryRepository;

    private TicketRepository ticketRepository;

    private SessionTicketRepository sessionTicketRepository;


    //Constructor inject repositories
    @Autowired
    public SessionServiceImpl(SessionRepository sessionRepository,
                              EventRepository eventRepository,
                              EventCategoryRepository eventCategoryRepository,
                              TicketRepository ticketRepository,
                              SessionTicketRepository sessionTicketRepository) {
        this.sessionRepository = sessionRepository;
        this.eventRepository = eventRepository;
        this.eventCategoryRepository = eventCategoryRepository;
        this.ticketRepository = ticketRepository;
        this.sessionTicketRepository = sessionTicketRepository;
    }

    //create new session
    @Override
    @Transactional
    public Session createSession(CreateSessionDto createSessionDto) {

        Event existingEvent = eventRepository.findById(createSessionDto.getEventId()).orElse(null);

        //Check if an event exists by id
        if (existingEvent == null) {
            return null;
        }

        //get the available sessions from that event
        int sessionCount = sessionRepository.findSessionsByEvent(createSessionDto.getEventId()).size();
        int nextSessionNumber = sessionCount + 1;

        //create a new session
        Session session = new Session();

        session.setSessionNumber("Session " + nextSessionNumber);
        session.setVenue(createSessionDto.getVenue());
        session.setDate(createSessionDto.getDate());
        session.setStartTime(createSessionDto.getStartTime());
        session.setEndTime(createSessionDto.getEndTime());
        session.setEvent(existingEvent);

        //session ticket instance
        List<SessionTicket> sessionTicketDetails = new ArrayList<>();

        //get tickets of event
        List<Ticket> tickets = existingEvent.getTickets();

        for (Ticket ticket : tickets) {
            SessionTicket sessionTicket = new SessionTicket();

            sessionTicket.setTicketId(ticket.getId());
            sessionTicket.setTicketType(ticket.getTicketType());
            sessionTicket.setTicketPrice(ticket.getPrice());
            sessionTicket.setInitialTicketCount(ticket.getTicketCount());
            sessionTicket.setRemainingTicketCount(ticket.getTicketCount());
            sessionTicket.setSoldTicketCount(0);
            sessionTicket.setSession(session);

            //save created instance in 'SessionTicket'
            sessionTicketRepository.save(sessionTicket);

            sessionTicketDetails.add(sessionTicket);
        }

        session.setSessionTicketDetails(sessionTicketDetails);

        return sessionRepository.save(session);
    }

    //find all existing sessions
    @Override
    public MultipleEntityResponse<SessionCardDto> findAllSessions() {

        MultipleEntityResponse<SessionCardDto> response = new MultipleEntityResponse<>();

        //find sessions list
        List<Session> sessionList = sessionRepository.findSessionsByDateAddedDesc();

        if (sessionList.isEmpty()) {
            response.setMessage("No sessions found for the date");
            return response;
        }

        //add sessions to the dto
        List<SessionCardDto> sessionDetails = sessionList.stream()
                .map(this::mapToSessionDto)
                .toList();

        response.setEntityList(sessionDetails);
        response.setRemarks("Latest sessions for : " + sessionList.size());
        response.setMessage("Sessions arranged by descending order");

        return response;
    }

    @Override
    public SingleEntityResponse<SessionCardDto> findSessionById(Long sessionId) {
        return null;
    }

    //Find all sessions relevant to an event
    @Override
    public FindSessionByEventResponse findSessionsByEvent(Long eventId) {
        //Create new response object
        FindSessionByEventResponse response = new FindSessionByEventResponse();

        //Check if there is an event for relevant id
        boolean isExist = eventRepository.existsById(eventId);

        if (!isExist) {
            response.setMessage("No relevant event found for entered id");
            return response;
        }

        //Get a session list
        List<Session> existingSessions = sessionRepository.findSessionsByEvent(eventId);

        if (existingSessions.isEmpty()) {
            response.setMessage("No sessions found for the event");
            return response;
        }

        List<SessionDetailsDto> sessionDetails = new ArrayList<>();

        for (Session session : existingSessions) {

            SessionDetailsDto sessionData = new SessionDetailsDto();

            sessionData.setId(session.getId());
            sessionData.setSessionNumber(session.getSessionNumber());
            sessionData.setVenue(session.getVenue());
            sessionData.setDate(session.getDate());
            sessionData.setStartTime(session.getStartTime());
            sessionData.setEndTime(session.getEndTime());
            sessionData.setAttendees(session.getAttendees());
            sessionData.setRevenue(session.getRevenue());
            sessionData.setProfit(session.getProfit());
            sessionData.setAttendees(session.getAttendees());
            sessionData.setRevenue(session.getRevenue());
            sessionData.setProfit(session.getProfit());

            sessionDetails.add(sessionData);
        }

        response.setMessage("Sessions list");
        response.setSessionList(sessionDetails);

        return response;
    }

    //update an existing sessions
    @Override
    @Transactional
    public Session updateSession(Long id, SessionUpdateDto sessionUpdateDto) {

        //find existing session
        Session existingSession = sessionRepository.findById(id).orElse(null);

        //check if there is an existing session
        if (existingSession == null) {
            return null;
        }

        existingSession.setVenue(sessionUpdateDto.getVenue());
        existingSession.setDate(sessionUpdateDto.getDate());
        existingSession.setStartTime(sessionUpdateDto.getStartTime());
        existingSession.setEndTime(sessionUpdateDto.getEndTime());

        return sessionRepository.save(existingSession);
    }

    //delete a session
    @Override
    public Boolean deleteSession(Long id) {

        //check if there is existing session
        boolean isExist = sessionRepository.existsById(id);

        if (!isExist) {
            return false;
        }

        sessionRepository.deleteById(id);

        return true;
    }

    @Override
    public MultipleEntityResponse<SessionCardDto> findUpcomingSessions(String categoryName) {

        MultipleEntityResponse<SessionCardDto> response = new MultipleEntityResponse<>();

        //check if the categoryExists
        boolean categoryExists = eventCategoryRepository.existsByCategory(categoryName);

        if (!categoryExists) {
            response.setMessage("Category not found: " + categoryName);
            return response;
        }

        //find category details
        EventCategory existingCategory = eventCategoryRepository.findByCategory(categoryName);

        //fetch sessions
        List<Session> sessionList = sessionRepository.findUpcomingSessionsByEventCategory(categoryName);

        //check if the sessions were found
        if (sessionList.isEmpty()) {
            response.setMessage("No sessions found for the category: " + categoryName);
            response.setRemarks(existingCategory.getCategory());
            return response;
        }

        //Convert session entities to sessionCardDto object using the helper method
        List<SessionCardDto> sessionDetails = sessionList.stream()
                .map(this::mapToSessionDto)
                .toList();

        response.setEntityList(sessionDetails);
        response.setRemarks(existingCategory.getCategory());
        response.setMessage("Sessions List for : " + categoryName);

        return response;
    }

    //find the sessions list descending ordered by date added
    @Override
    public MultipleEntityResponse<SessionCardDto> findLatestSessions() {

        MultipleEntityResponse<SessionCardDto> response = new MultipleEntityResponse<>();

        //find sessions list
        List<Session> sessionList = sessionRepository.findSessionsByDateAddedDesc();

        if (sessionList.isEmpty()) {
            response.setMessage("No sessions found for the date");
            response.setRemarks("");
            response.setEntityList(new ArrayList<>());
            return response;
        }

        //add sessions to the dto
        List<SessionCardDto> sessionDetails = sessionList.stream()
                .limit(8)//limit the maximum elements of the list to be 8
                .map(this::mapToSessionDto)
                .toList();

        response.setEntityList(sessionDetails);
        response.setRemarks("Latest sessions for : " + sessionDetails.size());
        response.setMessage("Sessions arranged by descending order");

        return response;
    }

    //find session details by session id
    @Override
    public SingleEntityResponse<SessionDetailsDto> findSessionDetailsBySessionId(Long sessionId) {

        SingleEntityResponse<SessionDetailsDto> response = new SingleEntityResponse<>();

        Session existingSession= sessionRepository.findById(sessionId).orElse(null);

        if(existingSession == null) {
            response.setMessage("No session found for the given id");
            return response;
        }

        SessionDetailsDto sessionData = new SessionDetailsDto();

        sessionData.setId(existingSession.getId());
        sessionData.setSessionNumber(existingSession.getSessionNumber());
        sessionData.setVenue(existingSession.getVenue());
        sessionData.setDate(existingSession.getDate());
        sessionData.setStartTime(existingSession.getStartTime());
        sessionData.setEndTime(existingSession.getEndTime());
        sessionData.setAttendees(existingSession.getAttendees());
        sessionData.setRevenue(existingSession.getRevenue());
        sessionData.setProfit(existingSession.getProfit());

        response.setMessage("Session details for : " + sessionId);
        response.setEntityData(sessionData);

        return response;
    }

    @Override
    public MultipleEntityResponse<SessionCardDto> findSessionsByEventName(String eventName) {
        MultipleEntityResponse<SessionCardDto> response = new MultipleEntityResponse<>();

        //fetch all sessions for an event
        List<Session> sessionList = sessionRepository.findByEventName(eventName);

        if(sessionList.isEmpty()) {
            response.setMessage("No sessions found for the given event :"+eventName);
            response.setRemarks("No of sessions "+0);
            response.setEntityList(new ArrayList<>());
            return response;
        }

        //add details to the dto
        List<SessionCardDto> sessionDetails = sessionList.stream()
                .map(this::mapToSessionDto)
                .toList();

        response.setEntityList(sessionDetails);
        response.setRemarks("No of sessions : " + sessionDetails.size());
        response.setMessage("Sessions of event "+eventName);

        return response;
    }


    //create a helper method to convert sessions-> session details dto
    private SessionCardDto mapToSessionDto(Session session) {
        SessionCardDto dto = new SessionCardDto();

        dto.setSessionId(session.getId());
        dto.setEventName(session.getEvent().getEventName());
        dto.setEventId(session.getEvent().getId());
        dto.setStartingDate(session.getDate());
        dto.setEventAddedDate(session.getEvent().getDateAdded());
        dto.setStartingTime(session.getStartTime());
        dto.setCoverImageLink(session.getEvent().getCoverImageLink());
        dto.setLocation(session.getVenue());
        dto.setCategoryName(session.getEvent().getEventCategory().getCategory());

        // Calculate minimum ticket price
        if (session.getEvent().getTickets() != null && !session.getEvent().getTickets().isEmpty()) {
            Double minPrice = session.getEvent().getTickets().stream()
                    .mapToDouble(ticket -> ticket.getPrice())
                    .min()
                    .orElse(0.0);
            dto.setMinTicketPrice(minPrice);
        } else {
            dto.setMinTicketPrice(0.0);
        }

        return dto;
    }
}