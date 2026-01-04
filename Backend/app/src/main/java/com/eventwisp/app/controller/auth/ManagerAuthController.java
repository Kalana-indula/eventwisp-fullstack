package com.eventwisp.app.controller.auth;

import com.eventwisp.app.dto.auth.AuthUserDetails;
import com.eventwisp.app.dto.manager.ManagerLoginDto;
import com.eventwisp.app.entity.Manager;
import com.eventwisp.app.security.jwt.JwtUtils;
import com.eventwisp.app.service.ManagerService;
import com.eventwisp.app.service.impl.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class ManagerAuthController {

    private ManagerService managerService;

    private PasswordEncoder passwordEncoder;

    private AuthenticationManager authenticationManager;

    private JwtUtils jwtUtils;

    private MailService mailService;

    @Autowired
    public ManagerAuthController(ManagerService managerService,
                                 PasswordEncoder passwordEncoder,
                                 AuthenticationManager authenticationManager,
                                 JwtUtils jwtUtils,
                                 MailService mailService) {
        this.managerService = managerService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.mailService = mailService;
    }

    //register manager
    @PostMapping("/managers")
    public ResponseEntity<?> registerManager(@RequestBody Manager manager) {

        if (managerService.isExistsByEmail(manager.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email Already Exists");
        }

        //encode the password
        manager.setPassword(passwordEncoder.encode(manager.getPassword()));

        //save
        Manager savedManager = managerService.createManager(manager);

        //send email
        mailService.registerManagerEmail(savedManager.getEmail(), savedManager.getFirstName());

        return ResponseEntity.status(HttpStatus.OK).body(managerService.createManager(savedManager));
    }

    //login as organizer
    @PostMapping("/managers/login")
    public ResponseEntity<?> loginAsOrganizer(@RequestBody ManagerLoginDto managerLoginDto) {

        try {
            //authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(managerLoginDto.getEmail(), managerLoginDto.getPassword()));

            //set the user as authenticated
            SecurityContextHolder.getContext().setAuthentication(authentication);

            //generate token
            String jwt = jwtUtils.generateJwtToken(authentication);

            //find manager
            Optional<Manager> existingManager = managerService.findByEmail(managerLoginDto.getEmail());

            AuthUserDetails userDetails = new AuthUserDetails();

            userDetails.setAuthToken(jwt);
            userDetails.setUserId(existingManager.get().getId());
            userDetails.setUserName(existingManager.get().getFirstName());
            userDetails.setUserRole(String.valueOf(existingManager.get().getUserRole()));

            return ResponseEntity.status(HttpStatus.OK).body(userDetails);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

    }
}
