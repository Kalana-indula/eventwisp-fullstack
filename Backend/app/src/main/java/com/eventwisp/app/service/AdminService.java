package com.eventwisp.app.service;

import com.eventwisp.app.dto.accountActions.DeleteUserDto;
import com.eventwisp.app.dto.response.UpdatePasswordResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.updateData.UpdateContactDetailsDto;
import com.eventwisp.app.dto.updateData.UpdateEmailDto;
import com.eventwisp.app.dto.updateData.UpdatePasswordDto;
import com.eventwisp.app.entity.Admin;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface AdminService {

    Admin createAdmin(Admin admin);

    List<Admin> getAllAdmins();

    Optional<Admin> findAdminByEmail(String email);

    Boolean isExistsByEmail(String email);

    Admin findAdminById(Long id);

    UpdatePasswordResponse<Admin> updateAdminPassword(Long id, UpdatePasswordDto passwordDto);

    SingleEntityResponse<Admin> updateAdminEmail(Long id, UpdateEmailDto emailDto);

    SingleEntityResponse<Admin> updateAdminContactDetails(Long id, UpdateContactDetailsDto contactDetailsDto);

    String deleteAdmin(Long id, DeleteUserDto deleteUserDto);
}
