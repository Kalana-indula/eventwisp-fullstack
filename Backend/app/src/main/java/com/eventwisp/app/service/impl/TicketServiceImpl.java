package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.TicketTypeUpdateDto;
import com.eventwisp.app.dto.TicketUpdateDto;
import com.eventwisp.app.dto.response.TicketUpdateResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.ticket.TicketDetailsDto;
import com.eventwisp.app.entity.Event;
import com.eventwisp.app.entity.Ticket;
import com.eventwisp.app.repository.EventRepository;
import com.eventwisp.app.repository.TicketRepository;
import com.eventwisp.app.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    //create an instance of 'TicketRepository'
    private TicketRepository ticketRepository;

    private EventRepository eventRepository;

    @Autowired
    public TicketServiceImpl(TicketRepository ticketRepository,
                             EventRepository eventRepository) {
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
    }

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    //Find an existing ticket type
    @Override
    public Ticket findTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }

    //Find tickets by event
    @Override
    public MultipleEntityResponse<TicketDetailsDto> findTicketsByEvent(Long id) {

        MultipleEntityResponse<TicketDetailsDto> response = new MultipleEntityResponse<>();

        //find event name
        Event existingEvent=eventRepository.findById(id).orElse(null);

        //find tickets list
        List<Ticket> tickets = ticketRepository.findTicketsByEvent(id);

        if(tickets.isEmpty()){
            response.setMessage("No tickets found for the event");
            return response;
        }

        List<TicketDetailsDto> dtos = new ArrayList<>();

        // Map each Ticket entity to TicketDetailsDto
        for (Ticket ticket : tickets) {
            TicketDetailsDto dto = new TicketDetailsDto();
            dto.setId(ticket.getId());
            dto.setTicketType(ticket.getTicketType());
            dto.setTicketPrice(ticket.getPrice());
            dto.setTicketCount(ticket.getTicketCount());
            dto.setSoldCount(ticket.getSoldCount());

            dtos.add(dto);
        }

        response.setEntityList(dtos);
        response.setMessage("Tickets retrieved successfully for event ID: " + existingEvent.getEventName());
        response.setRemarks("Tickets retrieved successfully for event ID: " + id);

        return response;
    }

    //Update existing ticket's details
    @Transactional
    @Override
    public List<TicketUpdateResponse> updateTicket(List<TicketUpdateDto> ticketData) {
        //Check if passed data is null
//        if (ticketData == null) {
//            throw new IllegalArgumentException("Ticket data list cannot be null");
//        }
//        //Updated ticket list
//        List<Ticket> updatedTicketList = new ArrayList<>();
//
//        //Create a response objects list
//        List<TicketUpdateResponse> responseList = new ArrayList<>();
//
//        //Iterate through the details of tickets
//        for (TicketUpdateDto newTicketDetails : ticketData) {
//            //Create a single update response
//            TicketUpdateResponse response = new TicketUpdateResponse();
//
//            //Set ticket id
//            response.setId(newTicketDetails.getId());
//
//            try {
//                //Find each ticket type by id
//                Ticket existingTicket = ticketRepository.findById(newTicketDetails.getId()).orElseThrow(
//                        () -> new RuntimeException("Ticket not found with Id " + newTicketDetails.getId()));
//
//
//                //Get current details
//                String currentTicketType = existingTicket.getTicketType();
//                double currentTicketPrice = existingTicket.getPrice();
//                int currentTicketCount = existingTicket.getTicketCount();
//
//                //Check if the newTicketDetails has a ticketType
//                if (newTicketDetails.getTicketType() == null) {
//                    existingTicket.setTicketType(currentTicketType);
//                } else {
//                    existingTicket.setTicketType(newTicketDetails.getTicketType());
//                }
//
//                //Check if the newTicketDetails has a price
//                if (newTicketDetails.getPrice() == null) {
//                    existingTicket.setPrice(currentTicketPrice);
//                } else {
//                    existingTicket.setPrice(newTicketDetails.getPrice());
//                }
//
//                //Check if the newTicketDetails has a ticketCount
//                if (newTicketDetails.getTicketCount() == null) {
//                    existingTicket.setTicketCount(currentTicketCount);
//                } else {
//                    existingTicket.setTicketCount(newTicketDetails.getTicketCount());
//                }
//
//                updatedTicketList.add(existingTicket);
//                response.setSuccess(true);
//            }catch (Exception e){
//                response.setSuccess(false);
//                response.setMessage(e.getMessage());
//            }
//            //Add new response to the response list
//            responseList.add(response);
//
//        }
//        //Batch save all the tickets
//        List<Ticket> updatedTickets=ticketRepository.saveAll(updatedTicketList);
//
//        //Update responses with the saved tickets
//        for (TicketUpdateResponse updateResponse:responseList){
//            if(updateResponse.isSuccess()){
//                Ticket updatedTicket=updatedTickets.stream()
//                        .filter(t->t.getId().equals(updateResponse.getId()))
//                        .findFirst()
//                        .orElse(null);
//                updateResponse.setTicket(updatedTicket);
//            }
//        }
//        return responseList;

        return null;
    }

    //Update ticket type
    @Override
    @Transactional
    public Ticket updateTicketType(Long id, TicketTypeUpdateDto ticketTypeUpdateDto) {

        //Check if the ticket exists
//        Ticket ticketType=ticketRepository.findById(id).orElse(null);
//
//        if(ticketType==null){
//            return null;
//        }
//
//        ticketType.setTicketType(ticketTypeUpdateDto.getTicketType());
//        ticketType.setTicketCount(ticketTypeUpdateDto.getTicketCount());
//        ticketType.setPrice(ticketTypeUpdateDto.getPrice());

//        return ticketRepository.save(ticketType);

        return null;
    }

    @Override
    public Boolean deleteTicket(Long id) {

        //check if the ticket exists
        boolean isExist=ticketRepository.existsById(id);

        //Return false if not exists
        if(!isExist){
            return false;
        }

        //delete the ticket if exists
        ticketRepository.deleteById(id);

        return true;
    }


}