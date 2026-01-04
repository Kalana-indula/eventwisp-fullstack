package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.ManagerUpdateDto;
import com.eventwisp.app.dto.accountActions.DeleteUserDto;
import com.eventwisp.app.dto.response.UpdatePasswordResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.response.general.UpdateResponse;
import com.eventwisp.app.dto.updateData.UpdateContactDetailsDto;
import com.eventwisp.app.dto.updateData.UpdateEmailDto;
import com.eventwisp.app.dto.updateData.UpdatePasswordDto;
import com.eventwisp.app.entity.Manager;
import com.eventwisp.app.entity.Organizer;
import com.eventwisp.app.repository.ManagerRepository;
import com.eventwisp.app.repository.OrganizerRepository;
import com.eventwisp.app.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ManagerServiceImpl implements ManagerService {

    //creating an instance of manager repository
    private ManagerRepository managerRepository;

    private OrganizerRepository organizerRepository;

    private PasswordEncoder passwordEncoder;

    //injecting 'ManagerRepository'
    @Autowired
    public ManagerServiceImpl(ManagerRepository managerRepository,
                              PasswordEncoder passwordEncoder,
                              OrganizerRepository organizerRepository){
        this.managerRepository=managerRepository;
        this.passwordEncoder=passwordEncoder;
        this.organizerRepository=organizerRepository;
    }

    //Create a new manager
    @Override
    public Manager createManager(Manager manager) {
        return managerRepository.save(manager);
    }

    //Find all available managers
    @Override
    public List<Manager> findAllManagers() {
        return managerRepository.findAll();
    }

    //Find manager by id
    @Override
    public Manager findManagerById(Long id) {
        return managerRepository.findById(id).orElse(null);
    }

    @Override
    public Optional<Manager> findByEmail(String email) {
        return managerRepository.findByEmail(email);
    }

    @Override
    public Boolean isExistsByEmail(String email) {
        return managerRepository.existsByEmail(email);
    }

    //find currently assigned manager
    @Override
    public Manager findAssignedManager() {
        return managerRepository.findAssignedManager();
    }

    //Update an existing 'Manager'
    @Override
    public Manager updateManager(Long id, ManagerUpdateDto managerUpdateDto) {

        //Find an existing 'Manager'
        Manager existingManager=managerRepository.findById(id).orElse(null);

        //Check if the 'Manager' exists
        if(existingManager==null){
            return null;
        }

        //Get current values
        String currentPhone= existingManager.getPhone();
        String currentEmail= existingManager.getEmail();
        String currentPassword= existingManager.getPassword();


        //Check if dto has a new phone number
        if(managerUpdateDto.getPhone()==null || managerUpdateDto.getPhone().isEmpty()){
            //If true set current phone number
            existingManager.setPhone(currentPhone);
        }else {
            //If false set new phone number
            existingManager.setPhone(managerUpdateDto.getPhone());
        }

        //Check if dto has a new email
        if(managerUpdateDto.getEmail()==null || managerUpdateDto.getEmail().isEmpty()){
            //If true set current email
            existingManager.setEmail(currentEmail);
        }else{
            //If false set new email
            existingManager.setEmail(managerUpdateDto.getEmail());
        }

        //Check if dto has a new password
        if(managerUpdateDto.getPassword()==null || managerUpdateDto.getPassword().isEmpty()){
            //If true set current password
            existingManager.setPassword(currentPassword);
        }else {
            //If false set new password
            //encode password
            managerUpdateDto.setPassword(passwordEncoder.encode(managerUpdateDto.getPassword()));

            existingManager.setPassword(managerUpdateDto.getPassword());
        }

        return managerRepository.save(existingManager);
    }

    @Override
    public UpdatePasswordResponse<Manager> updateManagerPassword(Long id, UpdatePasswordDto updatePasswordDto) {
        UpdatePasswordResponse<Manager> response = new UpdatePasswordResponse<>();

        // Find existing Manager
        Manager existingManager = managerRepository.findById(id).orElse(null);
        if (existingManager == null) {
            response.setSuccess(false);
            response.setMessage("Manager not found");
            return response;
        }

        //check if the passwords are correct
        boolean isPasswordMatch = passwordEncoder.matches(
                updatePasswordDto.getCurrentPassword(),
                existingManager.getPassword()
        );

        if (!isPasswordMatch) {
            response.setSuccess(false);
            response.setMessage("Current password is incorrect");
            return response;
        }

        // Encode and update password
        String updatedPassword = passwordEncoder.encode(updatePasswordDto.getNewPassword());

        existingManager.setPassword(updatedPassword);

        Manager updatedAdmin = managerRepository.save(existingManager);

        response.setSuccess(true);
        response.setMessage("Manager password updated successfully");
        response.setEntityData(updatedAdmin);
        return response;
    }

    @Override
    public SingleEntityResponse<Manager> updateManagerEmail(Long id, UpdateEmailDto updateEmailDto) {
        SingleEntityResponse<Manager> response = new SingleEntityResponse<>();

        // Find existing Manager
        Manager existingManager = managerRepository.findById(id).orElse(null);
        if (existingManager == null) {
            response.setMessage("Manager not found");
            return response;
        }

        // Update email (no encoding)
        existingManager.setEmail(updateEmailDto.getEmail());

        Manager updated = managerRepository.save(existingManager);

        response.setMessage("Manager email updated successfully");
        response.setEntityData(updated);
        return response;
    }

    @Override
    public SingleEntityResponse<Manager> updateManagerContactDetails(Long id, UpdateContactDetailsDto updateContactDetailsDto) {
        SingleEntityResponse<Manager> response = new SingleEntityResponse<>();

        // Find existing Manager
        Manager existingManager = managerRepository.findById(id).orElse(null);
        if (existingManager == null) {
            response.setMessage("Manager not found");
            return response;
        }

        // Update contact details (assuming 'phone' is the field)
        existingManager.setPhone(updateContactDetailsDto.getContactDetails());

        Manager updated = managerRepository.save(existingManager);

        response.setMessage("Manager contact details updated successfully");
        response.setEntityData(updated);
        return response;
    }

    @Override
    public UpdateResponse<Manager> setManagerStatus(Long id) {

        UpdateResponse<Manager> managerUpdateResponse=new UpdateResponse<>();

        //find existing manager
        Manager existingManager=managerRepository.findById(id).orElse(null);

        if(existingManager==null){
            managerUpdateResponse.setMessage("Manager not found");

            return managerUpdateResponse;
        }

        //find currently assigned manager
        Manager assignedManager=managerRepository.findAssignedManager();

        if((assignedManager!=null) && (Objects.equals(assignedManager.getId(), id))){
            assignedManager.setIsAssigned(false);
            assignedManager.setStatusUpdateDate(LocalDate.now());
            managerRepository.save(assignedManager);

            managerUpdateResponse.setMessage("Manager is un-assigned");
            managerUpdateResponse.setUpdatedData(assignedManager); 

            return managerUpdateResponse;
        }

        if(assignedManager==null){
            existingManager.setIsAssigned(true);
            existingManager.setStatusUpdateDate(LocalDate.now());
            managerRepository.save(existingManager);

            managerUpdateResponse.setMessage("Manager is assigned");
            managerUpdateResponse.setUpdatedData(existingManager);

            return managerUpdateResponse;
        }

        assignedManager.setIsAssigned(false);
        assignedManager.setStatusUpdateDate(LocalDate.now());

        //un-assigned currently assigned manager
        managerRepository.save(assignedManager);

        //assign new manager
        existingManager.setIsAssigned(true);
        existingManager.setStatusUpdateDate(LocalDate.now());

        managerRepository.save(existingManager);

        managerUpdateResponse.setMessage("Manager is assigned");
        managerUpdateResponse.setUpdatedData(existingManager);

        return managerUpdateResponse;

    }

    //Delete an existing manager
    @Override
    public String deleteManager(Long id, DeleteUserDto deleteUserDto) {

        Manager existingManager = managerRepository.findById(id).orElse(null);

        if(existingManager==null){
            return "Manager not found";
        }

        //check if the password is incorrect
        boolean isPasswordMatch = passwordEncoder.matches(
                deleteUserDto.getPassword(),
                existingManager.getPassword()
        );

        if (!isPasswordMatch) {
            return "Wrong password";
        }

        if(!Objects.equals(deleteUserDto.getEmail(), existingManager.getEmail())){
            return "Wrong email";
        }

        managerRepository.deleteById(id);

        return "Manager deleted successfully";
    }

    // remove organizer account from the system
    @Override
    public SingleEntityResponse<Boolean> removeOrganizerAccount(Long organizerId) {
        SingleEntityResponse<Boolean> response = new SingleEntityResponse<>();

        Organizer existingOrganizer = organizerRepository.findById(organizerId).orElse(null);
        if (existingOrganizer == null) {
            response.setMessage("Organizer not found");
            response.setEntityData(false);
            return response;
        }

        int activeCount = existingOrganizer.getActiveEventsCount() == null
                ? 0
                : existingOrganizer.getActiveEventsCount();

        if (activeCount > 0) {
            response.setMessage("Organizer already has active events");
            response.setEntityData(false);
            return response;
        }

        organizerRepository.deleteById(organizerId);
        response.setMessage("Organizer deleted successfully");
        response.setEntityData(true);
        return response;
    }
}
