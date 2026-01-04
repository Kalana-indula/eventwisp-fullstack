package com.eventwisp.app.controller.payments;

import com.eventwisp.app.dto.payment.CreateIntentRequest;
import com.eventwisp.app.entity.Session;
import com.eventwisp.app.entity.Ticket;
import com.eventwisp.app.repository.SessionRepository;
import com.eventwisp.app.repository.SessionTicketRepository;
import com.eventwisp.app.repository.TicketRepository;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentsController {

    private SessionRepository sessionRepository;

    private TicketRepository ticketRepository;

    private SessionTicketRepository sessionTicketRepository;

    @Autowired
    public PaymentsController(SessionRepository sessionRepository,
                              TicketRepository ticketRepository,
                              SessionTicketRepository sessionTicketRepository) {
        this.sessionRepository = sessionRepository;
        this.ticketRepository = ticketRepository;
        this.sessionTicketRepository = sessionTicketRepository;
    }

    @PostMapping("/create-intent")
    public Map<String,Object> createIntent(@RequestBody CreateIntentRequest req) throws Exception {

        //validate session
        Session session=sessionRepository.findById(req.getSessionId()).orElseThrow(()->new IllegalArgumentException("Session not found"));

        //compute amount
        List<Long> ticketIds = req.getTicketIdList();
        double total=0.0;

        //check remaining counts
        for (Long id:ticketIds) {
            Ticket ticket=ticketRepository.findById(id)
                    .orElseThrow(()->new IllegalArgumentException("Invalid ticket "+id));
            total+=ticket.getPrice();
        }

        //charge in USD cents
        long amountInCents=Math.max(1,Math.round(total*100));

        Map<String,Object> params=new HashMap<>();

        params.put("amount",amountInCents);
        params.put("currency","usd");//test mode with test currency
        params.put("automatic_payment_methods",Map.of("enabled",true));

        // Put helpful context in metadata
        Map<String, String> metadata = new HashMap<>();
        metadata.put("sessionId", String.valueOf(req.getSessionId()));
        metadata.put("ticketCount", String.valueOf(ticketIds.size()));
        metadata.put("email", req.getEmail());   // for reconciliation
        params.put("metadata", metadata);

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        return Map.of(
                "clientSecret", paymentIntent.getClientSecret(),
                "paymentIntentId", paymentIntent.getId(),
                "amount", amountInCents
        );
    }

}
