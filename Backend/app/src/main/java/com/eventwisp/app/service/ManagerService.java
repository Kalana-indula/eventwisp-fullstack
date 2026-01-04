package com.eventwisp.app.service;

import com.eventwisp.app.dto.ManagerUpdateDto;
import com.eventwisp.app.dto.accountActions.DeleteUserDto;
import com.eventwisp.app.dto.response.UpdatePasswordResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.response.general.UpdateResponse;
import com.eventwisp.app.dto.updateData.UpdateContactDetailsDto;
import com.eventwisp.app.dto.updateData.UpdateEmailDto;
import com.eventwisp.app.dto.updateData.UpdatePasswordDto;
import com.eventwisp.app.entity.Manager;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface ManagerService {

    Manager createManager(Manager manager);

    List<Manager> findAllManagers();

    Manager findManagerById(Long id);

    Optional<Manager> findByEmail(String email);

    Boolean isExistsByEmail(String email);

    Manager findAssignedManager();

    Manager updateManager(Long id, ManagerUpdateDto managerUpdateDto);

    UpdatePasswordResponse<Manager> updateManagerPassword(Long id, UpdatePasswordDto updatePasswordDto);

    SingleEntityResponse<Manager> updateManagerEmail(Long id, UpdateEmailDto updateEmailDto);

    SingleEntityResponse<Manager> updateManagerContactDetails(Long id, UpdateContactDetailsDto updateContactDetailsDto);

    UpdateResponse<Manager> setManagerStatus(Long id);

    String deleteManager(Long id, DeleteUserDto deleteUserDto);

    SingleEntityResponse<Boolean> removeOrganizerAccount(Long id);
}
