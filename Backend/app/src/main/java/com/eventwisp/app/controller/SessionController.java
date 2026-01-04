package com.eventwisp.app.controller;

import com.eventwisp.app.dto.response.FindSessionByEventResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.sessionDto.CreateSessionDto;
import com.eventwisp.app.dto.sessionDto.SessionCardDto;
import com.eventwisp.app.dto.sessionDto.SessionDetailsDto;
import com.eventwisp.app.dto.sessionDto.SessionUpdateDto;
import com.eventwisp.app.entity.Session;
import com.eventwisp.app.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SessionController {

    //Instance of sessionService
    private SessionService sessionService;

    @Autowired
    public SessionController(SessionService sessionService){
        this.sessionService=sessionService;
    }

    //create a new session
    @PostMapping("/sessions")
    public ResponseEntity<?> createSession(@RequestBody CreateSessionDto createSessionDto){
        try{
            Session session=sessionService.createSession(createSessionDto);

            if(session==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found");
            }

            return ResponseEntity.status(HttpStatus.OK).body(session);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Find all existing sessions
    @GetMapping("/sessions")
    public ResponseEntity<?> findAllSessions(){
        try {
            MultipleEntityResponse<SessionCardDto> response = sessionService.findAllSessions();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving sessions: " + e.getMessage());
        }
    }

    //Find session by eventId
    @GetMapping("/events/{eventId}/sessions")
    public ResponseEntity<?> findSessionsByEvent(@PathVariable Long eventId){
        try{
            // Find session by id
            FindSessionByEventResponse response= sessionService.findSessionsByEvent(eventId);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find session details by id
    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<?> findSessionDetailsById(@PathVariable Long sessionId) {
        try {
            SingleEntityResponse<SessionDetailsDto> response = sessionService.findSessionDetailsBySessionId(sessionId);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find upcoming event sessions
    @GetMapping("/events/categories/{categoryName}/sessions")
    public ResponseEntity<?> findUpcomingSessionsByCategory(@PathVariable String categoryName){
        try {
            MultipleEntityResponse<SessionCardDto> response = sessionService.findUpcomingSessions(categoryName);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving sessions: " + e.getMessage());
        }
    }

    //find sessions by event name
    @GetMapping("/events/name/{eventName}/sessions")
    public ResponseEntity<?> findSessionsByEventName(@PathVariable String eventName){
        try {
            MultipleEntityResponse<SessionCardDto> response = sessionService.findSessionsByEventName(eventName);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find latest upcoming sessions
    @GetMapping("/events/sessions/latest")
    public ResponseEntity<?> findLatestSessions() {
        try {
            MultipleEntityResponse<SessionCardDto> response = sessionService.findLatestSessions();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving latest sessions: " + e.getMessage());
        }
    }

    //Update session
    @PutMapping("/sessions/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Long id,@RequestBody SessionUpdateDto sessionUpdateDto){
        try {
            Session updatedSession= sessionService.updateSession(id,sessionUpdateDto);

            if(updatedSession==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No session found");
            }

            return ResponseEntity.status(HttpStatus.OK).body(updatedSession);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //delete a session
    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id){
        try {
            boolean isDeleted= sessionService.deleteSession(id);

            if(!isDeleted){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Session not found");
            }

            return ResponseEntity.status(HttpStatus.OK).body("Session deleted successfully");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
