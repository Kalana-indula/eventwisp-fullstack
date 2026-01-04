package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.booking.BookingEmailDto;
import com.eventwisp.app.dto.organizer.OrganizerDetailsDto;
import com.eventwisp.app.dto.response.EventCreateResponse;
import com.eventwisp.app.dto.response.general.UpdateResponse;
import com.eventwisp.app.entity.Booking;
import com.eventwisp.app.entity.Event;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class MailService {
    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    //Register admin email
    public void registerAdminEmail(String to,String name) {
        String subject="Admin Account Registered Successfully";

        String receiver=to;

        String message="Dear "+name+" ,\n\n You are now an admin of Eventwisp. \n\n Best regards, \n Eventwisp team";

        sendEmail(receiver,subject,message);
    }

    //delete notification
    public void deleteAdminEmail(String to,String name) {
        String subject="Admin Account Deactivation Confirmation";

        String receiver=to;

        String message="Dear "+name+" ,\n\n Your admin account on Eventwisp successfully deleted. \n\n Best regards, \n Eventwisp team";

        sendEmail(receiver,subject,message);
    }

    //Register a new manger
    public void registerManagerEmail(String to,String name) {
        String subject="Manager Account Registered Successfully";

        String receiver=to;

        String message="Dear "+name+" ,\n\n You are now a manager of Eventwisp. \n\n Best regards, \n Eventwisp team";

        sendEmail(receiver,subject,message);
    }

    //Delete manager email
    public void deleteManagerEmail(String to,String name) {
        String subject="Manager Account Deactivation Confirmation";

        String receiver=to;

        String message="Dear "+name+" ,\n\n Your manager account on Eventwisp successfully deleted. \n\n Best regards, \n Eventwisp team";

        sendEmail(receiver,subject,message);
    }

    // Register an organizer email
    public void registerOrganizerEmail(String to, String name) {
        String subject = "Organizer Registration Request Received";
        String receiver = to;

        String message =
                "Dear " + name + ",\n\n" +
                        "Thank you for registering as an organizer on Eventwisp.\n\n" +
                        "We’ve successfully received your registration request. Our team will review your details and let you know once your account has been activated.\n\n" +
                        "Best regards,\nEventwisp team";

        sendEmail(receiver, subject, message);
    }


    //Delete organizer email
    public void deleteOrganizerEmail(String to,String name){
        String subject="Organizer Account Deactivation Confirmation";

        String receiver=to;

        String message="Dear "+name+" ,\n\n Your organizer account on Eventwisp successfully deleted. \n\n Best regards, \n Eventwisp team";

        sendEmail(receiver,subject,message);
    }

    // approve/disapprove organizer email
    public void organizerStatusUpdateEmail(UpdateResponse<OrganizerDetailsDto> response) {
        if (response == null || response.getUpdatedData() == null) return;

        OrganizerDetailsDto dto = response.getUpdatedData();
        String to = dto.getEmail();
        if (to == null || to.isBlank()) return;

        // extract first name safely
        String fullName = dto.getName();
        String firstName = (fullName != null && !fullName.isBlank())
                ? fullName.split(" ")[0]
                : "Organizer";

        boolean approved = Boolean.TRUE.equals(dto.getIsApproved());
        boolean disapproved = Boolean.TRUE.equals(dto.getIsDisapproved());

        // If state is inconsistent or not final, skip sending
        if ((approved && disapproved) || (!approved && !disapproved)) return;

        if (approved) {
            String subject = "Your Organizer Account Has Been Approved";
            String message =
                    "Dear " + firstName + ",\n\n" +
                            "Great news! Your organizer account on Eventwisp has been approved.\n\n" +
                            "You can now sign in, create events, manage tickets, and track performance from your dashboard.\n\n" +
                            "Cheers,\nEventwisp team";
            sendEmail(to, subject, message);
            return;
        }

        if (disapproved) {
            String subject = "Organizer Account Status — Not Approved";
            String reason = response.getMessage();
            StringBuilder msg = new StringBuilder()
                    .append("Dear ").append(firstName).append(",\n\n")
                    .append("We’re sorry—your organizer account was not approved at this time.\n");
            if (reason != null && !reason.isBlank()) {
                msg.append("\nReason: ").append(reason).append("\n");
            }
            msg.append("\nYou’re welcome to update your details and reapply.\n\n")
                    .append("Best regards,\nEventwisp team");
            sendEmail(to, subject, msg.toString());
        }
    }


    //Add event email
    public void addEventEmail(EventCreateResponse response){
        String subject="Event Request Received";

        //organizer email
        String receiver=response.getEvent().getOrganizer().getEmail();

        //organizer name
        String organizerName=response.getEvent().getOrganizer().getFirstName();

        String message="Dear "+organizerName+" ,\n\n Thank you for submitting your event for publication. We’ve successfully received your request and our team is currently reviewing it.\n" +
                "\n" +
                "You’ll receive a notification once your event has been approved and is ready to be hosted on our platform.\n" +
                "\n" +
                "If you have any questions in the meantime, feel free to contact our support team.  \n\n Cheers, \n Eventwisp team";

        sendEmail(receiver,subject,message);
    }

    // event status updated email
    public void eventStatusUpdateEmail(UpdateResponse<Event> response){
        String subject = "Event Status Notification";

        Event event = response.getUpdatedData();
        if (event == null || event.getOrganizer() == null) {
            return; // or log/throw as you prefer
        }

        String receiver = event.getOrganizer().getEmail();
        String organizerName = event.getOrganizer().getFirstName();
        String eventName = event.getEventName();

        String status = "";
        if (event.getEventStatus() != null && event.getEventStatus().getStatusName() != null) {
            status = event.getEventStatus().getStatusName();
        }

        StringBuilder message = new StringBuilder();
        message.append("Dear ").append(organizerName).append(",\n\n");

        switch (status.toLowerCase()) {
            case "approved":
                message.append("Good news! Your event \"").append(eventName).append("\" has been approved.\n")
                        .append("Start date: ").append(event.getStartingDate()).append("\n\n")
                        .append("You can now proceed with ticketing and promotion.\n\n")
                        .append("Cheers,\nEventwisp team");
                break;

            case "disapproved":
                message.append("We’re sorry—your event \"").append(eventName).append("\" was not approved at this time.\n");
                String reason = response.getMessage();
                if (reason != null && !reason.isBlank()) {
                    message.append("\nReason: ").append(reason).append("\n");
                }
                message.append("\nYou’re welcome to make the necessary updates and resubmit.\n\n")
                        .append("Best regards,\nEventwisp team");
                break;

            case "completed":
                message.append("Congratulations! Your event \"").append(eventName).append("\" has been successfully completed.\n\n")
                        .append("Thank you for hosting with Eventwisp — we hope it was a great success!\n")
                        .append("You can now review event performance and earnings from your dashboard.\n\n")
                        .append("Warm regards,\nEventwisp team");
                break;

            default:
                message.append("The status of your event \"").append(eventName).append("\" was updated to: ")
                        .append(status.isBlank() ? "Unknown" : status).append(".\n\n")
                        .append("Best regards,\nEventwisp team");
                break;
        }


        sendEmail(receiver, subject, message.toString());
    }

    // send booking confirmation email (HTML + inline QR)
    public void bookingConfirmationEmail(BookingEmailDto payload) {
        if (payload == null) {
            throw new IllegalArgumentException("Payload is required");
        }
        String to = payload.getTo();
        String bookingId = payload.getBookingId();
        String qrBase64 = payload.getQrPngBase64();

        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("Recipient email is required");
        }
        if (bookingId == null || bookingId.isBlank()) {
            throw new IllegalArgumentException("Booking ID is required");
        }
        if (qrBase64 == null || qrBase64.isBlank()) {
            throw new IllegalArgumentException("QR image (base64) is required");
        }

        try {
            byte[] qrBytes = Base64.getDecoder().decode(qrBase64);

            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Your booking is confirmed — " + bookingId);

            // Refined message: clear + friendly; conveys your requested meaning
            String html = """
                <p>Hi,</p>
                <p>Your booking was successful. Please keep the QR code and Booking ID below to collect your tickets at the counter.</p>
                <p><strong>Booking ID:</strong> %s</p>
                <p><img src="cid:qrImage" alt="Booking QR" style="max-width:240px; height:auto;" /></p>
                <p>Thank you for choosing Eventwisp.</p>
                """.formatted(bookingId);

            helper.setText(html, true);

            // Inline QR image so it renders inside the email body
            helper.addInline("qrImage", new ByteArrayResource(qrBytes), "image/png");

            // (Optional) Also attach as a file:
            // helper.addAttachment("booking-qr.png", new ByteArrayResource(qrBytes), "image/png");

            mailSender.send(mime);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to send booking confirmation email", ex);
        }
    }

    // send ticket issuance confirmation email
    public void ticketIssueConfirmationEmail(Booking booking) {
        if (booking == null) return;

        String to = booking.getEmail();
        if (to == null || to.isBlank()) return;

        String firstName = (booking.getFirstName() != null && !booking.getFirstName().isBlank())
                ? booking.getFirstName()
                : "Attendee";

        Event event = booking.getEvent();
        String eventName = (event != null && event.getEventName() != null && !event.getEventName().isBlank())
                ? event.getEventName()
                : "your event";

        String bookingId = booking.getBookingId() != null ? booking.getBookingId() : "-";
        Integer ticketCount = booking.getTicketCount(); // may be null
        String issuedDate = booking.getTicketIssuedDate() != null ? booking.getTicketIssuedDate().toString() : null;
        String issuedTime = booking.getTicketIssuedTime() != null ? booking.getTicketIssuedTime().toString() : null;

        String subject = "Tickets issued — " + eventName;

        StringBuilder body = new StringBuilder()
                .append("Dear ").append(firstName).append(",\n\n")
                .append("Great news! Your tickets for \"").append(eventName).append("\" have been issued successfully.\n\n")
                .append("Booking ID: ").append(bookingId).append("\n");

        if (ticketCount != null) {
            body.append("Ticket count: ").append(ticketCount).append("\n");
        }
        if (issuedDate != null || issuedTime != null) {
            body.append("Issued on: ")
                    .append(issuedDate != null ? issuedDate : "")
                    .append(issuedDate != null && issuedTime != null ? " " : "")
                    .append(issuedTime != null ? issuedTime : "")
                    .append("\n");
        }

        body.append("\nPlease keep this Booking ID handy. If QR tickets were provided separately, bring them (printed or on your phone) to the entrance for faster check-in.\n\n")
                .append("Have an amazing time,\n")
                .append("Eventwisp team");

        sendEmail(to, subject, body.toString());
    }

}
