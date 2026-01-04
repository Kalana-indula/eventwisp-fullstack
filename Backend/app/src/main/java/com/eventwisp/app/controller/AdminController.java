package com.eventwisp.app.controller;

import com.eventwisp.app.dto.accountActions.DeleteUserDto;
import com.eventwisp.app.dto.response.UpdatePasswordResponse;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.dto.updateData.UpdateContactDetailsDto;
import com.eventwisp.app.dto.updateData.UpdateEmailDto;
import com.eventwisp.app.dto.updateData.UpdatePasswordDto;
import com.eventwisp.app.entity.Admin;
import com.eventwisp.app.service.AdminService;
import com.eventwisp.app.service.impl.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class AdminController {


    //create an instance of 'AdminService'
    private AdminService adminService;

    private MailService mailService;

    //Inject an 'AdminService'
    @Autowired
    public AdminController(AdminService adminService, MailService mailService){
        this.adminService=adminService;
        this.mailService=mailService;
    }

    @PostMapping("/admins")
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(adminService.createAdmin(admin));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/admins")
    public ResponseEntity<?> findAllAdmins(){
        try {
            //Get all admins
            List<Admin> allAdmins=adminService.getAllAdmins();

            //Check if the admins list is empty
            if(!allAdmins.isEmpty()){
                //If true, return all available admins
                return ResponseEntity.status(HttpStatus.OK).body(allAdmins);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No admins found");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/admins/{id}")
    public ResponseEntity<?> findAdminById(@PathVariable Long id){
        try {

            Admin existingAdmin= adminService.findAdminById(id);
            //Check if the existing admin is null
            if(existingAdmin!=null){
                return ResponseEntity.status(HttpStatus.OK).body(existingAdmin);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No admin found for entered id");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @PutMapping("/admins/{id}/password")
    public ResponseEntity<?> updateAdminPassword(@PathVariable Long id, @RequestBody UpdatePasswordDto passwordDto){
        try {
            UpdatePasswordResponse<Admin> response = adminService.updateAdminPassword(id,passwordDto);

            if ("Current password is incorrect".equalsIgnoreCase(response.getMessage()) || "Admin not found".equalsIgnoreCase(response.getMessage())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @PutMapping("/admins/{id}/email")
    public ResponseEntity<?> updateAdminEmail(@PathVariable Long id, @RequestBody UpdateEmailDto emailDto){
        try {
            SingleEntityResponse<Admin> response = adminService.updateAdminEmail(id,emailDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/admins/{id}/contact")
    public ResponseEntity<?> updateAdminContactDetails(@PathVariable Long id, @RequestBody UpdateContactDetailsDto contactDetailsDto){
        try {
            SingleEntityResponse<Admin> response = adminService.updateAdminContactDetails(id,contactDetailsDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id, @RequestBody DeleteUserDto deleteUserDto){
        try {
            //get admin name
            String adminName=adminService.findAdminById(id).getFirstName();

            String isDeleted=adminService.deleteAdmin(id,deleteUserDto);

            mailService.deleteAdminEmail(deleteUserDto.getEmail(),adminName);

            return ResponseEntity.status(HttpStatus.OK).body(isDeleted);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
