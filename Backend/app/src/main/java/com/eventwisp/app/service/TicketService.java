package com.eventwisp.app.service;

import com.eventwisp.app.dto.TicketTypeUpdateDto;
import com.eventwisp.app.dto.TicketUpdateDto;
import com.eventwisp.app.dto.response.TicketUpdateResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.ticket.TicketDetailsDto;
import com.eventwisp.app.entity.Ticket;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TicketService {

    //get all ticket types
    List<Ticket> getAllTickets();

    //find a ticket type by id
    Ticket findTicketById(Long id);

    //Find tickets by event
    MultipleEntityResponse<TicketDetailsDto> findTicketsByEvent(Long id);

    //update the ticket details
    List<TicketUpdateResponse> updateTicket(List<TicketUpdateDto> ticketData);

    //Update ticket type
    Ticket updateTicketType(Long id, TicketTypeUpdateDto ticketTypeUpdateDto);

    //delete an existing ticket type
    Boolean deleteTicket(Long id);

}
