package com.eventwisp.app.controller.auth;

import com.eventwisp.app.dto.auth.AuthUserDetails;
import com.eventwisp.app.dto.organizer.CreateOrganizerDto;
import com.eventwisp.app.dto.organizer.OrganizerLoginDto;
import com.eventwisp.app.entity.Organizer;
import com.eventwisp.app.security.jwt.JwtUtils;
import com.eventwisp.app.service.OrganizerService;
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
public class OrganizerAuthController {

    private OrganizerService organizerService;

    private PasswordEncoder passwordEncoder;

    private AuthenticationManager authenticationManager;

    private JwtUtils jwtUtils;

    private MailService mailService;

    @Autowired
    public OrganizerAuthController(OrganizerService organizerService,
                                   PasswordEncoder passwordEncoder,
                                   AuthenticationManager authenticationManager,
                                   JwtUtils jwtUtils,
                                   MailService mailService) {
        this.organizerService = organizerService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.mailService = mailService;
    }

    //register organizer
    @PostMapping("/organizers")
    public ResponseEntity<?> registerOrganizer(@RequestBody CreateOrganizerDto createOrganizerDto) {

        if (organizerService.isExistsByEmail(createOrganizerDto.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email Already Exists");
        }

        //encode the password
        createOrganizerDto.setPassword(passwordEncoder.encode(createOrganizerDto.getPassword()));

        //save
        Organizer savedOrganizer = organizerService.addOrganizer(createOrganizerDto);

        //send email
        mailService.registerOrganizerEmail(savedOrganizer.getEmail(), savedOrganizer.getFirstName());

        return ResponseEntity.status(HttpStatus.OK).body(savedOrganizer);
    }

    //login as organizer
    @PostMapping("/organizers/login")
    public ResponseEntity<?> loginAsOrganizer(@RequestBody OrganizerLoginDto organizerLoginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            organizerLoginDto.getEmail(),
                            organizerLoginDto.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            Optional<Organizer> existingOrganizer = organizerService.findOrganizerByEmail(organizerLoginDto.getEmail());

            AuthUserDetails userDetails = new AuthUserDetails();
            userDetails.setAuthToken(jwt);
            userDetails.setUserId(existingOrganizer.get().getId());
            userDetails.setUserName(existingOrganizer.get().getFirstName());
            userDetails.setUserRole(String.valueOf(existingOrganizer.get().getUserRole()));
            userDetails.setIsApproved(existingOrganizer.get().getIsApproved());

            return ResponseEntity.ok(userDetails);

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
    }


}
