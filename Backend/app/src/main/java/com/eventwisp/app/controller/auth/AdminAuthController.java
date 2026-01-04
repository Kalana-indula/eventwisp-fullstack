package com.eventwisp.app.controller.auth;

import com.eventwisp.app.dto.admin.AdminLoginDto;
import com.eventwisp.app.dto.auth.AuthUserDetails;
import com.eventwisp.app.entity.Admin;
import com.eventwisp.app.security.jwt.JwtUtils;
import com.eventwisp.app.service.AdminService;
import com.eventwisp.app.service.impl.MailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AdminAuthController {

    private AdminService adminService;

    private PasswordEncoder passwordEncoder;

    private AuthenticationManager authenticationManager;

    private JwtUtils jwtUtils;

    private MailService mailService;

    public AdminAuthController(AdminService adminService,
                               PasswordEncoder passwordEncoder,
                               AuthenticationManager authenticationManager,
                               JwtUtils jwtUtils,
                               MailService mailService) {
        this.adminService = adminService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.mailService = mailService;
    }

    @PostMapping("/admins")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {

        //check if admin exists
        if (adminService.isExistsByEmail(admin.getEmail())) {
            return ResponseEntity.badRequest().body("Email Already Exists");
        }

        //encode the password
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));

        //save
        Admin savedAdmin = adminService.createAdmin(admin);

        //send email
        mailService.registerAdminEmail(savedAdmin.getEmail(),savedAdmin.getFirstName());

        return ResponseEntity.status(HttpStatus.OK).body(savedAdmin);
    }

    @PostMapping("/admins/login")
    public ResponseEntity<?> loginAdmin(@RequestBody AdminLoginDto adminLoginDto) {
        //authenticate the user
        Authentication authentication=authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(adminLoginDto.getEmail(), adminLoginDto.getPassword()));

        //set the user as authenticated
        SecurityContextHolder.getContext().setAuthentication(authentication);

        //generate token
        String jwt = jwtUtils.generateJwtToken(authentication);

        //find admin
        Optional<Admin> existingAdmin = adminService.findAdminByEmail(adminLoginDto.getEmail());

        AuthUserDetails userDetails=new AuthUserDetails();

        userDetails.setAuthToken(jwt);
        userDetails.setUserId(existingAdmin.get().getId());
        userDetails.setUserName(existingAdmin.get().getFirstName());
        userDetails.setUserRole(String.valueOf(existingAdmin.get().getUserRole()));

        return ResponseEntity.status(HttpStatus.OK).body(userDetails);
    }
}
