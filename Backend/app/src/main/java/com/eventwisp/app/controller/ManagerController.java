package com.eventwisp.app.controller;

import com.eventwisp.app.dto.ManagerUpdateDto;
import com.eventwisp.app.dto.accountActions.DeleteUserDto;
import com.eventwisp.app.dto.response.UpdatePasswordResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.response.general.UpdateResponse;
import com.eventwisp.app.dto.updateData.UpdateContactDetailsDto;
import com.eventwisp.app.dto.updateData.UpdateEmailDto;
import com.eventwisp.app.dto.updateData.UpdatePasswordDto;
import com.eventwisp.app.entity.Manager;
import com.eventwisp.app.service.ManagerService;
import com.eventwisp.app.service.impl.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ManagerController {

    private ManagerService managerService;

    private MailService mailService;


    @Autowired
    public ManagerController(ManagerService managerService,
                             MailService mailService){
        this.managerService=managerService;
        this.mailService=mailService;
    }

    //Find all managers
    @GetMapping("/managers")
    public ResponseEntity<?> findAllManagers(){
        try {
            List<Manager> allManagers=managerService.findAllManagers();

            //Check if there any managers
            if(allManagers.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No manager found");
            }

            return ResponseEntity.status(HttpStatus.OK).body(allManagers);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Find managers by id
    @GetMapping("/managers/{id}")
    public ResponseEntity<?> findManagerById(@PathVariable Long id){
        try {
            Manager existingManager= managerService.findManagerById(id);

            //Check if there is a manger
            if(existingManager==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No manager found for entered id");
            }

            return ResponseEntity.status(HttpStatus.OK).body(existingManager);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //find currently assigned manager
    @GetMapping("/managers/assigned")
    public ResponseEntity<?> findAssignedManager(){
        try{
            Manager assignedManager= managerService.findAssignedManager();

            if(assignedManager==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No manager found is assigned");
            }

            return ResponseEntity.status(HttpStatus.OK).body(assignedManager);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Update a manager
    @PutMapping("/managers/{id}")
    public ResponseEntity<?> updateManager(@PathVariable Long id,@RequestBody ManagerUpdateDto managerUpdateDto){
        try {

            Manager updatedManager= managerService.updateManager(id,managerUpdateDto);

            //Check if the manager exists
            if(updatedManager==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No manager found for entered id");
            }

            return ResponseEntity.status(HttpStatus.OK).body(updatedManager);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/managers/{id}/password")
    public ResponseEntity<?> updateManagerPassword(@PathVariable Long id, @RequestBody UpdatePasswordDto passwordDto) {
        try {
            UpdatePasswordResponse<Manager> response = managerService.updateManagerPassword(id, passwordDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/managers/{id}/email")
    public ResponseEntity<?> updateManagerEmail(@PathVariable Long id, @RequestBody UpdateEmailDto emailDto) {
        try {
            SingleEntityResponse<Manager> response = managerService.updateManagerEmail(id, emailDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/managers/{id}/contact")
    public ResponseEntity<?> updateManagerContactDetails(@PathVariable Long id, @RequestBody UpdateContactDetailsDto contactDetailsDto) {
        try {
            SingleEntityResponse<Manager> response = managerService.updateManagerContactDetails(id, contactDetailsDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    //set manager status
    @PutMapping("/managers/{managerId}/update-status")
    public ResponseEntity<?> updateManagerStatus(@PathVariable Long managerId){
        try{
            UpdateResponse<Manager> managerUpdateResponse=managerService.setManagerStatus(managerId);

            if(managerUpdateResponse.getUpdatedData()==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(managerUpdateResponse.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK).body(managerUpdateResponse);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //delete organizer from the system
    @DeleteMapping("/managers/actions/organizers/{organizerId}/delete")
    public ResponseEntity<?> deleteOrganizerFromSystem(@PathVariable Long organizerId){
        try{
            SingleEntityResponse<Boolean> response=managerService.removeOrganizerAccount(organizerId);

            return ResponseEntity.status(HttpStatus.OK).body(response);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //Delete a manager
    @DeleteMapping("/managers/{id}")
    public ResponseEntity<?> deleteManager(@PathVariable Long id,@RequestBody DeleteUserDto deleteUserDto){
        try {
            //get manager name
            String managerName=managerService.findManagerById(id).getFirstName();

            String isDeleted= managerService.deleteManager(id,deleteUserDto);

            //send email
            mailService.deleteManagerEmail(deleteUserDto.getEmail(),managerName);

            return ResponseEntity.status(HttpStatus.OK).body(isDeleted);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
