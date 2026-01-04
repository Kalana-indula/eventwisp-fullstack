package com.eventwisp.app.controller;

import com.eventwisp.app.dto.accountActions.DeleteUserDto;
import com.eventwisp.app.dto.organizer.CreateOrganizerDto;
import com.eventwisp.app.dto.organizer.EarningDetails;
import com.eventwisp.app.dto.organizer.OrganizerDetailsDto;
import com.eventwisp.app.dto.organizer.OrganizerStatusDto;
import com.eventwisp.app.dto.response.UpdatePasswordResponse;
import com.eventwisp.app.dto.response.general.DeleteAccountResponse;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.response.general.UpdateResponse;
import com.eventwisp.app.dto.updateData.UpdateContactDetailsDto;
import com.eventwisp.app.dto.updateData.UpdateEmailDto;
import com.eventwisp.app.dto.updateData.UpdatePasswordDto;
import com.eventwisp.app.entity.Organizer;
import com.eventwisp.app.service.OrganizerService;
import com.eventwisp.app.service.impl.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OrganizerController {

    //Create an instance of "OrganizerService"
    private OrganizerService organizerService;

    //get a password encoder
    private PasswordEncoder passwordEncoder;

    private MailService mailService;

    //Inject an instance of "OrgnizerSerivce"
    @Autowired
    public OrganizerController(OrganizerService organizerService,
                               PasswordEncoder passwordEncoder,
                               MailService mailService){
        this.organizerService=organizerService;
        this.passwordEncoder=passwordEncoder;
        this.mailService=mailService;
    }

    @PostMapping("/organizers")
    public ResponseEntity<?> addOrganizer(@RequestBody CreateOrganizerDto createOrganizerDto){
        try {
            Organizer newOrganizer=organizerService.addOrganizer(createOrganizerDto);
            return ResponseEntity.status(HttpStatus.OK).body(newOrganizer);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Find all organizers
    @GetMapping("/organizers")
    public ResponseEntity<?> findAllOrganizers(){
        try {
            List<Organizer> allOrganizers=organizerService.getAllOrganizers();

            //Check if there any organizers available
            if(allOrganizers.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No organizers found");
            }

            return ResponseEntity.status(HttpStatus.OK).body(allOrganizers);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find all organizers
    @GetMapping("/organizers/details")
    public ResponseEntity<?> findAllOrganizersDetails(){
        try {
            MultipleEntityResponse<OrganizerDetailsDto> response = organizerService.getAllOrganizersDetails();

            if(response.getEntityList() == null || response.getEntityList().isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //get organizers count
    @GetMapping("/organizers/count")
    public ResponseEntity<?> findOrganizersCount(){
        try{
           int count = organizerService.getOrganizerCount();

           if(count==0){
               return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No organizers found");
           }

           return ResponseEntity.status(HttpStatus.OK).body(count);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Find organizer by id
    @GetMapping("/organizers/{id}")
    public ResponseEntity<?> findOrganizerById(@PathVariable Long id) {
        try {
            SingleEntityResponse<OrganizerDetailsDto> response = organizerService.getOrganizerDetailsById(id);

            if(response.getEntityData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find organizer by organizer id
    @GetMapping("/organizers/id/{organizerId}")
    public ResponseEntity<?> findOrganizerByOrganizerId(@PathVariable String organizerId) {
        try {
            SingleEntityResponse<OrganizerDetailsDto> response = organizerService.getOrganizerDetailsByOrganizerId(organizerId);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find earning details by organizer
    @GetMapping("/organizers/{organizerId}/earnings")
    ResponseEntity<?> findEarningDetailsByOrganizer(@PathVariable Long organizerId){
        try{
            SingleEntityResponse<EarningDetails> response=organizerService.getEarningsByOrganizer(organizerId);

            if(response.getEntityData()==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find earning details by generated organizer id
    @GetMapping("/organizers/id/{organizerId}/earnings")
    ResponseEntity<?> findEarningDetailsByOrganizerId(@PathVariable String organizerId){
        try{
            SingleEntityResponse<EarningDetails> response=organizerService.getEarningsByOrganizerId(organizerId);

            if(response.getEntityData()==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find earnings by all organizers
    @GetMapping("/organizers/earnings")
    public ResponseEntity<?> findEarningsByAllOrganizers(){
        try{
            MultipleEntityResponse<EarningDetails> response = organizerService.getEarningsByAllOrganizers();
            
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/organizers/pending")
    public ResponseEntity<?> findPendingOrganizers() {
        try {
            MultipleEntityResponse<OrganizerDetailsDto> response = organizerService.getPendingOrganizers();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //approved organizers
    @GetMapping("/organizers/approved")
    public ResponseEntity<?> findApprovedOrganizers() {
        try {
            MultipleEntityResponse<OrganizerDetailsDto> response = organizerService.getApprovedOrganizers();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find disapproved accounts
    @GetMapping("/organizers/disapproved")
    public ResponseEntity<?> findDisapprovedOrganizers() {
        try {
            MultipleEntityResponse<OrganizerDetailsDto> response = organizerService.getDisapprovedOrganizers();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //update password
    @PutMapping("/organizers/{id}/password")
    public ResponseEntity<?> updateOrganizerPassword(@PathVariable Long id, @RequestBody UpdatePasswordDto passwordDto){
        try{
            UpdatePasswordResponse<Organizer> response=organizerService.updateOrganizerPassword(id,passwordDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/organizers/{id}/email")
    public ResponseEntity<?> updateOrganizerEmail(@PathVariable Long id, @RequestBody UpdateEmailDto emailDto){
        try{
            SingleEntityResponse<Organizer> response=organizerService.updateOrganizerEmail(id,emailDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/organizers/{id}/contact")
    public ResponseEntity<?> updateOrganizerContactDetails(@PathVariable Long id, @RequestBody UpdateContactDetailsDto contactDetailsDto){
        try{
            SingleEntityResponse<Organizer> response=organizerService.updateOrganizerContactDetails(id,contactDetailsDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //update organizer status
    @PutMapping("/organizers/{id}/status")
    public ResponseEntity<?> updateOrganizerStatus(@PathVariable Long id, @RequestBody OrganizerStatusDto organizerStatusDto) {
        try {
            UpdateResponse<OrganizerDetailsDto> response = organizerService.updateOrganizerStatus(id, organizerStatusDto);

            if (response.getUpdatedData()==null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response.getMessage());
            }

            //send email
            mailService.organizerStatusUpdateEmail(response);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/organizers/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id,@RequestBody DeleteUserDto deleteUserDto){
        try{
            //get organizer name
            SingleEntityResponse<OrganizerDetailsDto> organizerDetails=organizerService.getOrganizerDetailsById(id);

            String organizerName=organizerDetails.getEntityData().getName();

            DeleteAccountResponse response=organizerService.deleteOrganizer(id,deleteUserDto);

            //send email after deletion
            mailService.deleteOrganizerEmail(deleteUserDto.getEmail(),organizerName);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
