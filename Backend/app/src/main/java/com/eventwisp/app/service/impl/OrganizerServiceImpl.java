package com.eventwisp.app.service.impl;

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
import com.eventwisp.app.enums.UserRoles;
import com.eventwisp.app.repository.OrganizerRepository;
import com.eventwisp.app.service.OrganizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrganizerServiceImpl implements OrganizerService {

    //Create a 'OrganizerRepository' instance
    private OrganizerRepository organizerRepository;

    private PasswordEncoder passwordEncoder;

    //Inject an instance of 'OrganizerRepository'
    @Autowired
    public OrganizerServiceImpl(OrganizerRepository organizerRepository,
                                PasswordEncoder passwordEncoder){
        this.organizerRepository=organizerRepository;
        this.passwordEncoder=passwordEncoder;
    }

    //create a new organizer
    @Override
    public Organizer addOrganizer(CreateOrganizerDto createOrganizerDto) {

        Organizer organizer=new Organizer();

        organizer.setFirstName(createOrganizerDto.getFirstName());
        organizer.setLastName(createOrganizerDto.getLastName());
        organizer.setNic(createOrganizerDto.getNic());
        organizer.setCompanyName(createOrganizerDto.getCompanyName());
        organizer.setPhone(createOrganizerDto.getPhone());
        organizer.setEmail(createOrganizerDto.getEmail());
        organizer.setPassword(createOrganizerDto.getPassword());
        organizer.setUserRole(UserRoles.ORGANIZER);

        Organizer savedOrganizer=organizerRepository.save(organizer);

        savedOrganizer.setOrganizerId("ORG-"+savedOrganizer.getId());

        return organizerRepository.save(savedOrganizer);
    }

    //find all organizers
    @Override
    public List<Organizer> getAllOrganizers() {

        return organizerRepository.findAll();
    }

    @Override
    public MultipleEntityResponse<OrganizerDetailsDto> getAllOrganizersDetails() {

        //existing organizers
        List<Organizer> existingOrganizers=organizerRepository.findAll();

        //response
        MultipleEntityResponse<OrganizerDetailsDto> response=new MultipleEntityResponse<>();

        if(existingOrganizers.isEmpty()){
            response.setMessage("No organizer found");
            return response;
        }

        //organizer details
        List<OrganizerDetailsDto> organizersDetails=new ArrayList<>();

        for(Organizer organizer:existingOrganizers){
            OrganizerDetailsDto details=new OrganizerDetailsDto();

            details.setId(organizer.getId());
            details.setName(organizer.getFirstName()+" "+organizer.getLastName());
            details.setNic(organizer.getNic());
            details.setEmail(organizer.getEmail());
            details.setPhone(organizer.getPhone());
            details.setPendingApproval(organizer.getPendingApproval());
            details.setIsApproved(organizer.getIsApproved());
            details.setIsDisapproved(organizer.getIsDisapproved());
            details.setTotalEarnings(organizer.getTotalEarnings());
            details.setTotalWithdrawals(organizer.getTotalWithdrawals());
            details.setCurrentBalance(organizer.getCurrentBalance());

            organizersDetails.add(details);
        }

        response.setEntityList(organizersDetails);
        response.setMessage("Organizer details found");

        return response;
    }

    //check if organizer exists by email
    @Override
    public Boolean isExistsByEmail(String email) {
        return organizerRepository.existsByEmail(email);
    }

    @Override
    public Optional<Organizer> findOrganizerByEmail(String email) {
        return organizerRepository.findByEmail(email);
    }

    //get organizer count
    @Override
    public Integer getOrganizerCount() {

        List<Organizer> organizerList=organizerRepository.findAll();


        return organizerList.size();
    }

    //Find an organizer by id
    @Override
    public SingleEntityResponse<OrganizerDetailsDto> getOrganizerDetailsById(Long id) {
        SingleEntityResponse<OrganizerDetailsDto> response = new SingleEntityResponse<>();

        // Find the organizer by ID
        Organizer organizer = organizerRepository.findById(id).orElse(null);

        if (organizer == null) {
            response.setMessage("Organizer not found with ID: " + id);
            return response;
        }

        // Create the details DTO
        OrganizerDetailsDto details = new OrganizerDetailsDto();
        details.setId(organizer.getId());
        details.setOrganizerId(organizer.getOrganizerId());
        details.setName(organizer.getFirstName() + " " + organizer.getLastName());
        details.setNic(organizer.getNic());
        details.setCompanyName(organizer.getCompanyName());
        details.setEmail(organizer.getEmail());
        details.setPhone(organizer.getPhone());
        details.setPendingApproval(organizer.getPendingApproval());
        details.setIsApproved(organizer.getIsApproved());
        details.setIsDisapproved(organizer.getIsDisapproved());
        details.setTotalEarnings(organizer.getTotalEarnings());
        details.setTotalWithdrawals(organizer.getTotalWithdrawals());
        details.setCurrentBalance(organizer.getCurrentBalance());
        details.setActiveEventsCount(organizer.getActiveEventsCount());

        // Set the response
        response.setMessage("Organizer details found");
        response.setEntityData(details);

        return response;
    }

    //find organizer details by organizer id
    @Override
    public SingleEntityResponse<OrganizerDetailsDto> getOrganizerDetailsByOrganizerId(String organizerId) {
        SingleEntityResponse<OrganizerDetailsDto> response = new SingleEntityResponse<>();

        Organizer organizer = organizerRepository.findOrganizerByOrganizerId(organizerId);
        if (organizer == null) {
            response.setMessage("Organizer not found with ID: " + organizerId);
            return response;
        }

        OrganizerDetailsDto details = new OrganizerDetailsDto();

        details.setId(organizer.getId());
        details.setOrganizerId(organizer.getOrganizerId());
        details.setName(organizer.getFirstName() + " " + organizer.getLastName());
        details.setNic(organizer.getNic());
        details.setCompanyName(organizer.getCompanyName());
        details.setEmail(organizer.getEmail());
        details.setPhone(organizer.getPhone());
        details.setPendingApproval(organizer.getPendingApproval());
        details.setIsApproved(organizer.getIsApproved());
        details.setIsDisapproved(organizer.getIsDisapproved());
        details.setTotalEarnings(organizer.getTotalEarnings());
        details.setTotalWithdrawals(organizer.getTotalWithdrawals());
        details.setCurrentBalance(organizer.getCurrentBalance());
        details.setActiveEventsCount(organizer.getActiveEventsCount());

        response.setMessage("Organizer details found");
        response.setEntityData(details);

        return response;
    }

    //find pending organizer accounts
    @Override
    public MultipleEntityResponse<OrganizerDetailsDto> getPendingOrganizers() {

        MultipleEntityResponse<OrganizerDetailsDto> response=new MultipleEntityResponse<>();

        List<Organizer> pendingAccounts=organizerRepository.pendingOrganizers();

        if(pendingAccounts.isEmpty()){
            response.setRemarks("0");
            response.setMessage("No pending organizer found");
            return response;
        }

        List<OrganizerDetailsDto> organizersDetails=new ArrayList<>();

        for(Organizer organizer:pendingAccounts){
            OrganizerDetailsDto details=new OrganizerDetailsDto();

            details.setId(organizer.getId());
            details.setOrganizerId(organizer.getOrganizerId());
            details.setName(organizer.getFirstName()+" "+organizer.getLastName());
            details.setNic(organizer.getNic());
            details.setEmail(organizer.getEmail());
            details.setPhone(organizer.getPhone());
            details.setPendingApproval(organizer.getPendingApproval());
            details.setIsApproved(organizer.getIsApproved());
            details.setIsDisapproved(organizer.getIsDisapproved());
            
            organizersDetails.add(details);
        }
        
        response.setEntityList(organizersDetails);
        response.setRemarks(String.valueOf(pendingAccounts.size()));
        response.setMessage("Organizer details found");

        return response;
    }

    //find approved organizer accounts
    @Override
    public MultipleEntityResponse<OrganizerDetailsDto> getApprovedOrganizers() {
        MultipleEntityResponse<OrganizerDetailsDto> response = new MultipleEntityResponse<>();

        List<Organizer> approvedAccounts = organizerRepository.approvedOrganizers();

        if(approvedAccounts.isEmpty()) {
            response.setMessage("No approved organizers found");
            return response;
        }

        List<OrganizerDetailsDto> organizersDetails = new ArrayList<>();

        for(Organizer organizer : approvedAccounts) {
            OrganizerDetailsDto details = new OrganizerDetailsDto();

            details.setId(organizer.getId());
            details.setOrganizerId(organizer.getOrganizerId());
            details.setName(organizer.getFirstName() + " " + organizer.getLastName());
            details.setNic(organizer.getNic());
            details.setEmail(organizer.getEmail());
            details.setPhone(organizer.getPhone());
            details.setPendingApproval(organizer.getPendingApproval());
            details.setIsApproved(organizer.getIsApproved());
            details.setIsDisapproved(organizer.getIsDisapproved());

            organizersDetails.add(details);
        }

        response.setEntityList(organizersDetails);
        response.setRemarks(String.valueOf(approvedAccounts.size()));
        response.setMessage("Approved organizer details found");

        return response;
    }

    //find disapproved organizer accounts
    @Override
    public MultipleEntityResponse<OrganizerDetailsDto> getDisapprovedOrganizers() {
        MultipleEntityResponse<OrganizerDetailsDto> response = new MultipleEntityResponse<>();

        List<Organizer> disapprovedAccounts = organizerRepository.disapprovedOrganizers();

        if(disapprovedAccounts.isEmpty()) {
            response.setMessage("No disapproved organizers found");
            return response;
        }

        List<OrganizerDetailsDto> organizersDetails = new ArrayList<>();

        for(Organizer organizer : disapprovedAccounts) {
            OrganizerDetailsDto details = new OrganizerDetailsDto();

            details.setId(organizer.getId());
            details.setOrganizerId(organizer.getOrganizerId());
            details.setName(organizer.getFirstName() + " " + organizer.getLastName());
            details.setNic(organizer.getNic());
            details.setEmail(organizer.getEmail());
            details.setPhone(organizer.getPhone());
            details.setPendingApproval(organizer.getPendingApproval());
            details.setIsApproved(organizer.getIsApproved());
            details.setIsDisapproved(organizer.getIsDisapproved());

            organizersDetails.add(details);
        }

        response.setEntityList(organizersDetails);
        response.setMessage("Disapproved organizer details found");

        return response;
    }

    //find earning details by organizer
    @Override
    public SingleEntityResponse<EarningDetails> getEarningsByOrganizer(Long organizerId) {

        //create response object
        SingleEntityResponse<EarningDetails> response = new SingleEntityResponse<>();

        //fetch earning details from organizer
        Organizer organizer=organizerRepository.findById(organizerId).orElse(null);

        if(organizer == null) {
            response.setMessage("Organizer not found");
            return response;
        }

        EarningDetails earningDetails=new EarningDetails();

        earningDetails.setOrganizerId(organizer.getOrganizerId());
        earningDetails.setOrganizerName(organizer.getFirstName() + " " + organizer.getLastName());
        earningDetails.setTotalEarnings(organizer.getTotalEarnings());
        earningDetails.setCurrentBalance(organizer.getCurrentBalance());
        earningDetails.setTotalWithdrawals(organizer.getTotalWithdrawals());

        response.setMessage("Earning details of organizer : "+organizer.getFirstName()+" "+organizer.getLastName());
        response.setEntityData(earningDetails);

        return response;
    }


    //find earning details by generated organizer id
    @Override
    public SingleEntityResponse<EarningDetails> getEarningsByOrganizerId(String organizerId) {
        //create response object
        SingleEntityResponse<EarningDetails> response = new SingleEntityResponse<>();

        //fetch earning details from organizer
        Organizer organizer=organizerRepository.findOrganizerByOrganizerId(organizerId);

        if(organizer == null) {
            response.setMessage("Organizer not found");
            return response;
        }

        EarningDetails earningDetails=new EarningDetails();

        earningDetails.setOrganizerId(organizer.getOrganizerId());
        earningDetails.setOrganizerName(organizer.getFirstName() + " " + organizer.getLastName());
        earningDetails.setTotalEarnings(organizer.getTotalEarnings());
        earningDetails.setCurrentBalance(organizer.getCurrentBalance());
        earningDetails.setTotalWithdrawals(organizer.getTotalWithdrawals());

        response.setMessage("Earning details of organizer : "+organizer.getFirstName()+" "+organizer.getLastName());
        response.setEntityData(earningDetails);

        return response;
    }

    //get earnings by all organizers
    @Override
    public MultipleEntityResponse<EarningDetails> getEarningsByAllOrganizers() {
        MultipleEntityResponse<EarningDetails> response = new MultipleEntityResponse<>();

        List<Organizer> organizers = organizerRepository.findAll();

        if (organizers.isEmpty()) {
            response.setMessage("No organizers found");
            response.setRemarks("Count : 0");
            return response;
        }

        List<EarningDetails> detailsList = organizers.stream()
                .map(o -> {
                    EarningDetails d = new EarningDetails();
                    d.setId(o.getId());
                    d.setOrganizerId(o.getOrganizerId());
                    d.setOrganizerName(o.getFirstName() + " " + o.getLastName());
                    d.setTotalEarnings(o.getTotalEarnings());
                    d.setTotalWithdrawals(o.getTotalWithdrawals());
                    d.setCurrentBalance(o.getCurrentBalance());

                    return d;
                })
                .toList();

        response.setEntityList(detailsList);
        response.setMessage("Organizers earnings list");
        response.setRemarks("Count : " + detailsList.size());

        return response;
    }

    //update organizer password
    @Override
    public UpdatePasswordResponse<Organizer> updateOrganizerPassword(Long id, UpdatePasswordDto passwordDto) {

        UpdatePasswordResponse<Organizer> response=new UpdatePasswordResponse<>();

        //Find the existing organizer
        Organizer existingOrganizer=organizerRepository.findById(id).orElse(null);

        if(existingOrganizer==null){
            response.setSuccess(false);
            response.setMessage("Organizer not found");
            return response;
        }

        //check if the current password is correct
        boolean isPasswordMatch = passwordEncoder.matches(
                passwordDto.getCurrentPassword(),
                existingOrganizer.getPassword()
        );

        if (!isPasswordMatch) {
            response.setSuccess(false);
            response.setMessage("Current password is incorrect");
            return response;
        }

        //encode password
        String updatedPassword=passwordEncoder.encode(passwordDto.getNewPassword());

        existingOrganizer.setPassword(updatedPassword);

        Organizer updatedOrganizer= organizerRepository.save(existingOrganizer);

        response.setSuccess(true);
        response.setMessage("Organizer password updated");
        response.setEntityData(updatedOrganizer);

        return response;
    }

    //update organizer email
    @Override
    public SingleEntityResponse<Organizer> updateOrganizerEmail(Long id, UpdateEmailDto emailDto) {
        SingleEntityResponse<Organizer> response = new SingleEntityResponse<>();

        //Find the existing organizer
        Organizer existingOrganizer = organizerRepository.findById(id).orElse(null);

        if (existingOrganizer == null) {
            response.setMessage("Organizer not found");
            return response;
        }

        //update email
        existingOrganizer.setEmail(emailDto.getEmail());

        Organizer updatedOrganizer= organizerRepository.save(existingOrganizer);

        response.setMessage("Organizer email updated");
        response.setEntityData(updatedOrganizer);

        return response;
    }

    //update organizer contact details
    @Override
    public SingleEntityResponse<Organizer> updateOrganizerContactDetails(Long id, UpdateContactDetailsDto contactDetailsDto) {
        SingleEntityResponse<Organizer> response = new SingleEntityResponse<>();

        //Find the existing organizer
        Organizer existingOrganizer = organizerRepository.findById(id).orElse(null);

        if (existingOrganizer == null) {
            response.setMessage("Organizer not found");
            return response;
        }

        //update contact details
        existingOrganizer.setPhone(contactDetailsDto.getContactDetails());

        Organizer updatedOrganizer= organizerRepository.save(existingOrganizer);

        response.setMessage("Organizer contact details updated");
        response.setEntityData(updatedOrganizer);

        return response;
    }

    //update organizer status
    @Override
    public UpdateResponse<OrganizerDetailsDto> updateOrganizerStatus(Long organizerId, OrganizerStatusDto organizerStatusDto) {

        UpdateResponse<OrganizerDetailsDto> response=new UpdateResponse<>();

        //find the organizer
        Organizer existingOrganizer=organizerRepository.findById(organizerId).orElse(null);

        if(existingOrganizer==null){
            response.setMessage("Organizer not found");
            return response;
        }

        existingOrganizer.setPendingApproval(organizerStatusDto.getPendingApproval());
        existingOrganizer.setIsApproved(organizerStatusDto.getIsApproved());
        existingOrganizer.setIsDisapproved(organizerStatusDto.getIsDisapproved());
        organizerRepository.save(existingOrganizer);

        OrganizerDetailsDto updatedDetails=new OrganizerDetailsDto();

        updatedDetails.setId(existingOrganizer.getId());
        updatedDetails.setName(existingOrganizer.getFirstName()+" "+existingOrganizer.getLastName());
        updatedDetails.setNic(existingOrganizer.getNic());
        updatedDetails.setEmail(existingOrganizer.getEmail());
        updatedDetails.setPhone(existingOrganizer.getPhone());
        updatedDetails.setPendingApproval(existingOrganizer.getPendingApproval());
        updatedDetails.setIsApproved(existingOrganizer.getIsApproved());
        updatedDetails.setIsDisapproved(existingOrganizer.getIsDisapproved());

        response.setMessage("Organizer status updated");
        response.setUpdatedData(updatedDetails);

        return response;
    }

    //Update
    @Override
    public DeleteAccountResponse deleteOrganizer(Long id, DeleteUserDto deleteUserDto) {

        DeleteAccountResponse response = new DeleteAccountResponse();

        // Find existing organizer
        Organizer existingOrganizer = organizerRepository.findById(id).orElse(null);
        if (existingOrganizer == null) {
            response.setSuccess(false);
            response.setMessage("Organizer not found");
            return response;
        }

        boolean isPasswordMatch = passwordEncoder.matches(
                deleteUserDto.getPassword(),
                existingOrganizer.getPassword()
        );

        //Verify password
        if (!isPasswordMatch) {
            response.setSuccess(false);
            response.setMessage("Password is incorrect");
            return response;
        }

        // Verify email
        if (!java.util.Objects.equals(deleteUserDto.getEmail(), existingOrganizer.getEmail())) {
            response.setSuccess(false);
            response.setMessage("Incorrect email");
            return response;
        }

        // Delete and respond
        organizerRepository.deleteById(id);

        response.setSuccess(true);
        response.setMessage("Organizer deleted successfully");

        return response;
    }
}
