package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.BookingDto;
import com.eventwisp.app.dto.booking.BookingDetailsDto;
import com.eventwisp.app.dto.response.CreateBookingResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.ticket.BookedTicketDetailsDto;
import com.eventwisp.app.dto.ticket.TicketIssueDto;
import com.eventwisp.app.entity.*;
import com.eventwisp.app.repository.*;
import com.eventwisp.app.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    //Create instances of repositories
    private BookingRepository bookingRepository;
    private EventRepository eventRepository;
    private TicketRepository ticketRepository;
    private SessionRepository sessionRepository;
    private BookingSequenceRepository bookingSequenceRepository;
    private OrganizerRepository organizerRepository;
    private SessionTicketRepository sessionTicketRepository;
    private MailService mailService;

    //Inject repositories
    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository,
                              EventRepository eventRepository,
                              TicketRepository ticketRepository,
                              SessionRepository sessionRepository,
                              BookingSequenceRepository bookingSequenceRepository,
                              OrganizerRepository organizerRepository,
                              SessionTicketRepository sessionTicketRepository,
                              MailService mailService) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
        this.sessionRepository = sessionRepository;
        this.bookingSequenceRepository = bookingSequenceRepository;
        this.organizerRepository = organizerRepository;
        this.sessionTicketRepository = sessionTicketRepository;
        this.mailService = mailService;
    }

    @Override
    @Transactional
    public CreateBookingResponse createBooking(BookingDto bookingDto) {

        CreateBookingResponse response = new CreateBookingResponse();

        //check if the session exists
        Session existingSession = sessionRepository.findById(bookingDto.getSessionId()).orElse(null);

        if (existingSession == null) {
            response.setMessage("No event found for the corresponding id");
            return response;
        }

        //Get event
        Event event = existingSession.getEvent();

        //get current attendees count for the event
        int currentEventAttendeesCount = event.getTotalAttendeesCount();

        //get current total earnings
        BigDecimal currentEarnings = event.getEarningsByEvent();

        //get current profit
        BigDecimal currentProfit = event.getTotalProfit();

        //get commission for this event
        double currentCommission = event.getCommission();

        //create new booking object
        Booking booking = new Booking();

        booking.setBookingId(generateBookingId());
        booking.setFirstName(bookingDto.getFirstName());
        booking.setLastName(bookingDto.getLastName());
        booking.setEmail(bookingDto.getEmail());
        booking.setPhone(bookingDto.getPhone());
        booking.setIdNumber(bookingDto.getIdNumber());
        booking.setBookingDate(LocalDate.now());
        booking.setBookingTime(LocalTime.now());
        booking.setSession(existingSession);
        booking.setEvent(event);

        //Create a list to store tickets
        List<Ticket> bookedTickets = new ArrayList<>();

        //get ticket details for the session
        List<SessionTicket> sessionTicketDetails=sessionTicketRepository.findSessionTicketsBySessionId(bookingDto.getSessionId());

        //ticket price
        double totalPrice = 0.0;
        int attendance = 0;

        //Find tickets for each id
        for (Long ticketId : bookingDto.getTicketIdList()) {
            Ticket ticket = ticketRepository.findById(ticketId).orElse(null);

            if(ticket!=null){
                //update session ticket details
                updateSessionTicketDetails(ticketId,sessionTicketDetails);

                attendance += 1;
                bookedTickets.add(ticket);
                totalPrice += ticket.getPrice();
            }
        }

        //calculate the profit from the booking
        double profit = totalPrice - totalPrice * (currentCommission/100);

        //set ticket count
        booking.setTicketCount(bookedTickets.size());

        //set the ticket list
        booking.setTickets(bookedTickets);

        //set total price
        booking.setTotalPrice(totalPrice);

        //update event details
        //get current event revenue,profit and attendees count
        event.setTotalAttendeesCount(currentEventAttendeesCount + attendance);
        event.setEarningsByEvent(currentEarnings.add(BigDecimal.valueOf(totalPrice)));
        event.setTotalProfit(currentProfit.add(BigDecimal.valueOf(profit)));

        //below method is not mandatory as saving handles by @Transactional (dirty checking)
        eventRepository.save(event);

        //get current session revenue,profit and attendees count
        BigDecimal currentSessionRevenue = existingSession.getRevenue();
        BigDecimal currentSessionProfit = existingSession.getProfit();
        int currentSessionAttendees = existingSession.getAttendees();

        //update session details
        existingSession.setRevenue(currentSessionRevenue.add(BigDecimal.valueOf(totalPrice)));
        existingSession.setProfit(currentSessionProfit.add(BigDecimal.valueOf(profit)));
        existingSession.setAttendees(currentSessionAttendees + attendance);

        sessionRepository.save(existingSession);

        //get organizer details
        Organizer organizer = event.getOrganizer();

        BigDecimal currentEarningsByOrganizer = organizer.getTotalEarnings();
        BigDecimal currentBalance = organizer.getCurrentBalance();

        //update organizer earnings
        organizer.setTotalEarnings(currentEarningsByOrganizer.add(BigDecimal.valueOf(profit)));
        organizer.setCurrentBalance(currentBalance.add(BigDecimal.valueOf(profit)));
        organizerRepository.save(organizer);

        Booking newBooking = bookingRepository.save(booking);

        //get booked ticket list
        List<Ticket> bookedTicketList=newBooking.getTickets();

        List<BookedTicketDetailsDto> ticketDetails=getBookedTicketDetails(bookedTicketList);

        //get new booking details
        BookingDetailsDto bookingDetails = new BookingDetailsDto();

        bookingDetails.setBookingId(newBooking.getBookingId());
        bookingDetails.setEventName(existingSession.getEvent().getEventName());
        bookingDetails.setName(newBooking.getFirstName() + " " + newBooking.getLastName());
        bookingDetails.setEmail(newBooking.getEmail());
        bookingDetails.setPhone(newBooking.getPhone());
        bookingDetails.setNic(newBooking.getIdNumber());
        bookingDetails.setTicketDetails(ticketDetails);

        response.setMessage("Booking successful");
        response.setBookingDetails(bookingDetails);

        return response;
    }

    //get all booking details
    @Override
    public MultipleEntityResponse<BookingDetailsDto> findAllBookings() {

        MultipleEntityResponse<BookingDetailsDto> response = new MultipleEntityResponse<>();

        //get all bookings
        List<Booking> bookings = bookingRepository.findAll();

        if (bookings.isEmpty()) {
            response.setMessage("No bookings found");
            return response;
        }

        List<BookingDetailsDto> bookingsDetails = new ArrayList<>();

        for (Booking booking : bookings) {
            BookingDetailsDto dto = new BookingDetailsDto();

            dto.setBookingId(booking.getBookingId());
            dto.setName(booking.getFirstName() + " " + booking.getLastName());
            dto.setEmail(booking.getEmail());
            dto.setPhone(booking.getPhone());
            dto.setNic(booking.getIdNumber());

            bookingsDetails.add(dto);
        }

        response.setMessage("Booking details");
        response.setEntityList(bookingsDetails);

        return response;
    }

    @Override
    public MultipleEntityResponse<BookingDetailsDto> findBookingsByEvent(Long eventId) {

        MultipleEntityResponse<BookingDetailsDto> response = new MultipleEntityResponse<>();

        // check if event exists
        boolean isExist = eventRepository.existsById(eventId);

        if (!isExist) {
            response.setMessage("No event found for entered id");
            return response;
        }

        // fetch bookings
        List<Booking> bookingList = bookingRepository.bookingsByEvent(eventId);

        // check if the list is empty
        if (bookingList.isEmpty()) {
            response.setMessage("No bookings found for the event");
            return response;
        }

        // map bookings -> DTOs
        List<BookingDetailsDto> bookingDtos = new ArrayList<>();
        for (Booking booking : bookingList) {

            BookingDetailsDto dto = new BookingDetailsDto();
            dto.setBookingId(booking.getBookingId());
            dto.setName(booking.getFirstName() + " " + booking.getLastName());
            dto.setEmail(booking.getEmail());
            dto.setPhone(booking.getPhone());
            dto.setNic(booking.getIdNumber());

            bookingDtos.add(dto);
        }

        response.setMessage("Bookings List");
        response.setEntityList(bookingDtos);

        return response;
    }

    //get booking details by id
    @Override
    public SingleEntityResponse<BookingDetailsDto> findBookingDetailsByBookingId(String bookingId) {

        //find booking details
        Booking existingBooking=bookingRepository.findByBookingId(bookingId);

        BookingDetailsDto bookingDetailsDto=new BookingDetailsDto();

        bookingDetailsDto.setBookingId(existingBooking.getBookingId());
        bookingDetailsDto.setEventName(existingBooking.getEvent().getEventName());
        bookingDetailsDto.setName(existingBooking.getFirstName() + " " + existingBooking.getLastName());
        bookingDetailsDto.setEmail(existingBooking.getEmail());
        bookingDetailsDto.setPhone(existingBooking.getPhone());
        bookingDetailsDto.setNic(existingBooking.getIdNumber());
        bookingDetailsDto.setTicketDetails(getBookedTicketDetails(existingBooking.getTickets()));
        bookingDetailsDto.setTicketIssued(existingBooking.getTicketIssued());
        bookingDetailsDto.setTicketIssuedDate(existingBooking.getTicketIssuedDate());
        bookingDetailsDto.setTicketIssuedTime(existingBooking.getTicketIssuedTime());

        SingleEntityResponse<BookingDetailsDto> response = new SingleEntityResponse<>();

        response.setEntityData(bookingDetailsDto);
        response.setMessage("Booking details");

        return response;
    }

    //issue ticket and get confirmed tickets are issued to the attendee at the counter
    @Override
    public SingleEntityResponse<TicketIssueDto> issueTickets(String bookingId) {

        //find booking details
        Booking existingBooking=bookingRepository.findByBookingId(bookingId);

        SingleEntityResponse<TicketIssueDto> response=new SingleEntityResponse<>();

        existingBooking.setTicketIssued(true);
        existingBooking.setTicketIssuedDate(LocalDate.now());
        existingBooking.setTicketIssuedTime(LocalTime.now());

        //save updated booking
        Booking updatedBooking = bookingRepository.save(existingBooking);

        //send email
        mailService.ticketIssueConfirmationEmail(updatedBooking);

        //get ticket issuance log
        TicketIssueDto ticketIssueDto = new TicketIssueDto();

        ticketIssueDto.setBookingId(updatedBooking.getBookingId());
        ticketIssueDto.setEventName(updatedBooking.getEvent().getEventName());
        ticketIssueDto.setIssueDate(updatedBooking.getTicketIssuedDate());
        ticketIssueDto.setIssueTime(updatedBooking.getTicketIssuedTime());
        ticketIssueDto.setTicketIssued(updatedBooking.getTicketIssued());

        response.setEntityData(ticketIssueDto);
        response.setMessage("Ticket issued successfully for booking id: " + updatedBooking.getBookingId());

        return response;
    }

    @Override
    public Long calculateExpectedAmountInCents(Long sessionId, List<Long> ticketIdList) {

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid session"));

        double total = 0.0;

        for (Long id : ticketIdList) {
            Ticket t = ticketRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid ticket " + id));
            total += t.getPrice();
        }

        return Math.max(1, Math.round(total * 100));
    }


    //generate booking id
    private String generateBookingId() {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String datePrefix = "BK" + today.format(formatter);

        BookingSequenceTracker tracker = bookingSequenceRepository.findById(today.toString())
                .orElseGet(() -> {
                    BookingSequenceTracker newTracker = new BookingSequenceTracker();
                    newTracker.setDate(today.toString());
                    newTracker.setSequence(0L);
                    return bookingSequenceRepository.save(newTracker);
                });

        synchronized (this) {
            long sequence = tracker.getSequence() + 1;
            tracker.setSequence(sequence);
            bookingSequenceRepository.save(tracker);
            return datePrefix + "-" + String.format("%03d", sequence);
        }
    }

    //update session ticket details
    private void updateSessionTicketDetails(Long ticketId, List<SessionTicket> sessionTicketDetails){
        for(SessionTicket sessionTicket : sessionTicketDetails){
            if(ticketId.equals(sessionTicket.getTicketId())){
                sessionTicket.setRemainingTicketCount(sessionTicket.getRemainingTicketCount()-1);
                sessionTicket.setSoldTicketCount(sessionTicket.getSoldTicketCount()+1);
                sessionTicketRepository.save(sessionTicket);
            }
        }
    }

    //get ticket details from a booking
    private List<BookedTicketDetailsDto> getBookedTicketDetails(List<Ticket> tickets) {
        List<BookedTicketDetailsDto> result = new ArrayList<>();
        if (tickets == null || tickets.isEmpty()) return result;

        for (Ticket t : tickets) {
            if (t == null) continue;
            String type = t.getTicketType(); // adapt if your getter differs
            if (type == null || type.isBlank()) type = "UNKNOWN";

            // find existing dto with same ticketType (case-insensitive match)
            BookedTicketDetailsDto existing = null;
            for (BookedTicketDetailsDto dto : result) {
                if (dto.getTicketType().equalsIgnoreCase(type)) {
                    existing = dto;
                    break;
                }
            }

            if (existing != null) {
                existing.setTicketCount(existing.getTicketCount() + 1);
            } else {
                BookedTicketDetailsDto dto = new BookedTicketDetailsDto();
                dto.setTicketType(type);
                dto.setTicketCount(1);
                result.add(dto);
            }
        }

        return result;
    }

}