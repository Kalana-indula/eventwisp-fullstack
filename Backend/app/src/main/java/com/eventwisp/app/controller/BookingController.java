package com.eventwisp.app.controller;

import com.eventwisp.app.dto.BookingDto;
import com.eventwisp.app.dto.booking.BookingDetailsDto;
import com.eventwisp.app.dto.booking.BookingEmailDto;
import com.eventwisp.app.dto.booking.BookingWithPaymentDto;
import com.eventwisp.app.dto.response.CreateBookingResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.ticket.TicketIssueDto;
import com.eventwisp.app.service.BookingService;
import com.eventwisp.app.service.impl.MailService;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class BookingController {

    //create an instance of services
    private BookingService bookingService;

    private MailService mailService;

    @Autowired
    public BookingController(BookingService bookingService,
                             MailService mailService) {
        this.bookingService = bookingService;
        this.mailService = mailService;
    }

    //create a new booking
    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@RequestBody BookingWithPaymentDto req) {
        try {

            //calculate expected amount from tickets
            long expectedAmount = bookingService.calculateExpectedAmountInCents(
                    req.getSessionId(), req.getTicketIdList());

            //retrieve and verify payment intent
            PaymentIntent paymentIntent=PaymentIntent.retrieve(req.getPaymentIntentId());

            if (!"succeeded".equals(paymentIntent.getStatus())) {
                return ResponseEntity.status(402).body("Payment not completed.");
            }

            if (paymentIntent.getAmount() == null || paymentIntent.getAmount() != expectedAmount) {
                return ResponseEntity.status(400).body("Amount mismatch.");
            }

            //create booking and booking dto
            BookingDto bookingDto=new BookingDto();
            bookingDto.setFirstName(req.getFirstName());
            bookingDto.setLastName(req.getLastName());
            bookingDto.setEmail(req.getEmail());
            bookingDto.setPhone(req.getPhone());
            bookingDto.setIdNumber(req.getIdNumber());
            bookingDto.setSessionId(req.getSessionId());
            bookingDto.setTicketIdList(req.getTicketIdList());

            CreateBookingResponse response = bookingService.createBooking(bookingDto);

            if (response.getBookingDetails() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //send a booking confirmation email after the QR
    @PostMapping("/emails/booking-confirmation")
    public ResponseEntity<?> sendBookingConfirmation(@RequestBody BookingEmailDto dto) {
        mailService.bookingConfirmationEmail(dto);
        return ResponseEntity.ok().body("{\"message\":\"Email sent\"}");
    }

    //find all bookings
    @GetMapping("/bookings")
    public ResponseEntity<?> findAllBookings() {
        try {
            MultipleEntityResponse<BookingDetailsDto> bookings = bookingService.findAllBookings();

            if (bookings.getEntityList().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No bookings found");
            }

            return ResponseEntity.status(HttpStatus.OK).body(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // find booking by booking id
    @GetMapping("/events/bookings/{bookingId}")
    public ResponseEntity<?> findBookingByBookingId(@PathVariable String bookingId) {
        try {
            SingleEntityResponse<BookingDetailsDto> response = bookingService.findBookingDetailsByBookingId(bookingId);

            if (response.getEntityData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No booking found for the given ID");
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    // find bookings by event id
    @GetMapping("/events/{eventId}/bookings")
    public ResponseEntity<?> findBookingsByEvent(@PathVariable Long eventId) {
        try {
            // get bookings
            MultipleEntityResponse<BookingDetailsDto> response = bookingService.findBookingsByEvent(eventId);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/events/{bookingId}/issue-tickets")
    public ResponseEntity<?> issueTickets(@PathVariable String bookingId) {
        try {

            SingleEntityResponse<TicketIssueDto> response = bookingService.issueTickets(bookingId);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
