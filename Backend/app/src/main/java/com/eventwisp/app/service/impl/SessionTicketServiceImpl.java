package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.sessionDto.EventParticipationDetails;
import com.eventwisp.app.dto.ticket.SessionTicketDetails;
import com.eventwisp.app.entity.Session;
import com.eventwisp.app.entity.SessionTicket;
import com.eventwisp.app.repository.SessionRepository;
import com.eventwisp.app.repository.SessionTicketRepository;
import com.eventwisp.app.service.SessionTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SessionTicketServiceImpl implements SessionTicketService {

    private SessionTicketRepository sessionTicketRepository;
    private SessionRepository sessionRepository;

    @Autowired
    public SessionTicketServiceImpl(SessionTicketRepository sessionTicketRepository,
                                    SessionRepository sessionRepository) {
        this.sessionTicketRepository = sessionTicketRepository;
        this.sessionRepository = sessionRepository;
    }

    @Override
    public MultipleEntityResponse<SessionTicketDetails> getTicketDetailsBySessionId(Long sessionId) {

        MultipleEntityResponse<SessionTicketDetails> response = new MultipleEntityResponse<>();

        //fetch session ticket list
        List<SessionTicket> sessionTickets = sessionTicketRepository.findSessionTicketsBySessionId(sessionId);

        List<SessionTicketDetails> sessionTicketDetailsList = getTicketDetailsList(sessionId,sessionTickets);

        response.setMessage("Ticket details for the session ID : " + sessionId);
        response.setRemarks("Number of ticket types : " + sessionTickets.size());
        response.setEntityList(sessionTicketDetailsList);

        return response;
    }

    //get all the ticket selling details of events per session
    @Override
    public MultipleEntityResponse<EventParticipationDetails> getEventTicketSalesBySession(Long eventId) {

        MultipleEntityResponse<EventParticipationDetails> response = new MultipleEntityResponse<>();

        //get sessions by event
        List<Session> eventSessionList=sessionRepository.findSessionsByEvent(eventId);

        //check if event has sessions
        if(eventSessionList.isEmpty()){
            response.setMessage("No session found for event ID : " + eventId);
            response.setRemarks("Sessions found : "+0);
            return response;
        }

        //event participation details list
        List<EventParticipationDetails> participationDetailsList=new ArrayList<>();

        for(Session session:eventSessionList){
            EventParticipationDetails participationDetails=new EventParticipationDetails();

            //get session tickets list
            List<SessionTicket> sessionTickets=sessionTicketRepository.findSessionTicketsBySessionId(session.getId());

            participationDetails.setSessionId(session.getId());
            participationDetails.setSessionNumber(session.getSessionNumber());
            participationDetails.setTicketDetails(getTicketDetailsList(session.getId(),sessionTickets));

            //add session participant details to the list
            participationDetailsList.add(participationDetails);
        }

        response.setMessage("Ticket details for the event ID : " + eventId);
        response.setRemarks("Number of session : " + eventSessionList.size());
        response.setEntityList(participationDetailsList);

        return response;
    }

    //get ticket details list
    private List<SessionTicketDetails> getTicketDetailsList(Long sessionId, List<SessionTicket> sessionTickets) {
        List<SessionTicketDetails> ticketDetails = new ArrayList<>();

        for (SessionTicket sessionTicket : sessionTickets) {
            SessionTicketDetails ticketDetailsDto = new SessionTicketDetails();

            ticketDetailsDto.setTicketId(sessionTicket.getTicketId());
            ticketDetailsDto.setSessionId(sessionId);
            ticketDetailsDto.setEventId(sessionTicket.getSession().getEvent().getId());
            ticketDetailsDto.setTicketType(sessionTicket.getTicketType());
            ticketDetailsDto.setTicketPrice(sessionTicket.getTicketPrice());
            ticketDetailsDto.setInitialTicketCount(sessionTicket.getInitialTicketCount());
            ticketDetailsDto.setRemainingTicketCount(sessionTicket.getRemainingTicketCount());
            ticketDetailsDto.setSoldTicketCount(sessionTicket.getSoldTicketCount());

            ticketDetails.add(ticketDetailsDto);
        }

        return ticketDetails;
    }
}
