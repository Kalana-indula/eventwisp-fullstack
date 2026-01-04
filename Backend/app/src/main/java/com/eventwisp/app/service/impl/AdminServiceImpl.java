package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.accountActions.DeleteUserDto;
import com.eventwisp.app.dto.response.UpdatePasswordResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.updateData.UpdateContactDetailsDto;
import com.eventwisp.app.dto.updateData.UpdateEmailDto;
import com.eventwisp.app.dto.updateData.UpdatePasswordDto;
import com.eventwisp.app.entity.Admin;
import com.eventwisp.app.repository.AdminRepository;
import com.eventwisp.app.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    //get an instance of 'AdminRepository'
    private AdminRepository adminRepository;

    private PasswordEncoder passwordEncoder;

    //inject 'AdminRepository'
    @Autowired
    public AdminServiceImpl(AdminRepository adminRepository,
                            PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //create a new 'Admin'
    @Override
    public Admin createAdmin(Admin admin) {

        Admin savedAdmin=adminRepository.save(admin);

        return savedAdmin;
    }

    //find all available admins
    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Optional<Admin> findAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    @Override
    public Boolean isExistsByEmail(String email) {
        return adminRepository.existsByEmail(email);
    }

    //Find an 'Admin' by id
    @Override
    public Admin findAdminById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }


    @Override
    public UpdatePasswordResponse<Admin> updateAdminPassword(Long id, UpdatePasswordDto passwordDto) {

        UpdatePasswordResponse<Admin> response= new UpdatePasswordResponse<>();

        //Find existing 'Admin'
        Admin existingAdmin = adminRepository.findById(id).orElse(null);

        if (existingAdmin == null) {
            response.setSuccess(false);
            response.setMessage("Admin not found");
            return response;
        }

        //check if the current password is correct
        boolean isPasswordMatch = passwordEncoder.matches(
                passwordDto.getCurrentPassword(),
                existingAdmin.getPassword()
        );

        if (!isPasswordMatch) {
            response.setSuccess(false);
            response.setMessage("Current password is incorrect");
            return response;
        }

        String updatedPassword = passwordEncoder.encode(passwordDto.getNewPassword());

        existingAdmin.setPassword(updatedPassword);

        Admin updatedAdmin = adminRepository.save(existingAdmin);

        response.setSuccess(true);
        response.setMessage("Admin password updated successfully");
        response.setEntityData(updatedAdmin);

        return response;
    }

    @Override
    public SingleEntityResponse<Admin> updateAdminEmail(Long id, UpdateEmailDto emailDto) {
        SingleEntityResponse<Admin> response = new SingleEntityResponse<>();

        //Find existing 'Admin'
        Admin existingAdmin = adminRepository.findById(id).orElse(null);

        if (existingAdmin == null) {
            response.setMessage("Admin not found");
            return response;
        }

        //update email
        existingAdmin.setEmail(emailDto.getEmail());

        Admin updatedAdmin = adminRepository.save(existingAdmin);

        response.setMessage("Admin email updated successfully");
        response.setEntityData(updatedAdmin);

        return response;
    }

    @Override
    public SingleEntityResponse<Admin> updateAdminContactDetails(Long id, UpdateContactDetailsDto contactDetailsDto) {
        SingleEntityResponse<Admin> response = new SingleEntityResponse<>();

        //Find existing 'Admin'
        Admin existingAdmin = adminRepository.findById(id).orElse(null);

        if (existingAdmin == null) {
            response.setMessage("Admin not found");
            return response;
        }

        //update contact details
        existingAdmin.setPhone(contactDetailsDto.getContactDetails());

        Admin updatedAdmin = adminRepository.save(existingAdmin);

        response.setMessage("Admin contact details updated successfully");
        response.setEntityData(updatedAdmin);

        return response;
    }

    //delete an existing admin
    @Override
    public String deleteAdmin(Long id, DeleteUserDto deleteUserDto) {

        Admin existingAdmin = adminRepository.findById(id).orElse(null);

        if(existingAdmin == null) {
            return "Admin not found";
        }

        //check if the current password is correct
        boolean isPasswordMatch = passwordEncoder.matches(
                deleteUserDto.getPassword(),
                existingAdmin.getPassword()
        );


        if(!isPasswordMatch){
            return "Password is incorrect";
        }

        if(!Objects.equals(deleteUserDto.getEmail(), existingAdmin.getEmail())){
            return "Incorrect email";
        }

        adminRepository.deleteById(id);

        return "Admin deleted successfully";
    }

}
