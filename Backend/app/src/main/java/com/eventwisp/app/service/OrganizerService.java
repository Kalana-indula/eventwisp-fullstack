package com.eventwisp.app.service;

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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface OrganizerService {
    Organizer addOrganizer(CreateOrganizerDto createOrganizerDto);

    List<Organizer> getAllOrganizers();

    MultipleEntityResponse<OrganizerDetailsDto> getAllOrganizersDetails();

    Boolean isExistsByEmail(String email);

    Optional<Organizer> findOrganizerByEmail(String email);

    Integer getOrganizerCount();

    SingleEntityResponse<OrganizerDetailsDto> getOrganizerDetailsById(Long id);

    //find organizer details by organizer id
    SingleEntityResponse<OrganizerDetailsDto> getOrganizerDetailsByOrganizerId(String organizerId);

    //find all pending organizer accounts
    MultipleEntityResponse<OrganizerDetailsDto> getPendingOrganizers();

    //find all approved organizer accounts
    MultipleEntityResponse<OrganizerDetailsDto> getApprovedOrganizers();

    //find all disapproved organizer accounts
    MultipleEntityResponse<OrganizerDetailsDto> getDisapprovedOrganizers();

    //get earnings by organizer
    SingleEntityResponse<EarningDetails> getEarningsByOrganizer(Long organizerId);

    //get earnings by organizer
    SingleEntityResponse<EarningDetails> getEarningsByOrganizerId(String organizerId);

    //get earnings by all organizers
    MultipleEntityResponse<EarningDetails> getEarningsByAllOrganizers();

    UpdatePasswordResponse<Organizer> updateOrganizerPassword(Long id, UpdatePasswordDto passwordDto);

    SingleEntityResponse<Organizer> updateOrganizerEmail(Long id, UpdateEmailDto emailDto);

    SingleEntityResponse<Organizer> updateOrganizerContactDetails(Long id, UpdateContactDetailsDto contactDetailsDto);

    UpdateResponse<OrganizerDetailsDto> updateOrganizerStatus(Long id, OrganizerStatusDto organizerStatusDto);

    DeleteAccountResponse deleteOrganizer(Long id, DeleteUserDto deleteUserDto);
}
