package com.eventwisp.app.service.impl;

import com.eventwisp.app.entity.PasswordResetToken;
import com.eventwisp.app.enums.UserType;
import com.eventwisp.app.repository.AdminRepository;
import com.eventwisp.app.repository.ManagerRepository;
import com.eventwisp.app.repository.OrganizerRepository;
import com.eventwisp.app.repository.PasswordResetTokenRepository;
import com.eventwisp.app.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    private PasswordResetTokenRepository passwordResetTokenRepository;

    private OrganizerRepository organizerRepository;

    private AdminRepository adminRepository;

    private ManagerRepository managerRepository;

    private MailService mailService;

    private PasswordEncoder passwordEncoder;

    @Autowired
    public PasswordResetServiceImpl(PasswordResetTokenRepository passwordResetTokenRepository,
                                    OrganizerRepository organizerRepository,
                                    AdminRepository adminRepository,
                                    ManagerRepository managerRepository,
                                    MailService mailService,
                                    PasswordEncoder passwordEncoder) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.organizerRepository = organizerRepository;
        this.adminRepository = adminRepository;
        this.managerRepository = managerRepository;
        this.mailService = mailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void requestReset(String email) {
        // 1️⃣ Find the user and its type (Admin / Organizer / Manager)
        Optional<UserRef> ref = findUserByEmail(email);

        if (ref.isEmpty()) return; // silently ignore unknown emails

        // 2️⃣ Generate a random token and store its hash
        String plain = UUID.randomUUID().toString();
        String tokenHash = sha256Hex(plain);

        PasswordResetToken prt = new PasswordResetToken();
        prt.setUserId(ref.get().id());
        prt.setUserType(ref.get().type());
        prt.setTokenHash(tokenHash);
        prt.setExpiresAt(LocalDateTime.now().plusMinutes(20));
        prt.setUsed(false);
        passwordResetTokenRepository.save(prt);

        // 3️⃣ Choose the correct base URL depending on user type
        String baseUrl;
        switch (ref.get().type()) {
            case ADMIN -> baseUrl = "http://localhost:3000/admin/auth/reset?token=";
            case MANAGER -> baseUrl = "http://localhost:3000/manager/auth/reset?token=";
            case ORGANIZER -> baseUrl = "http://localhost:3000/auth/reset?token=";
            default -> baseUrl = "http://localhost:3000/auth/reset?token=";
        }

        // 4️⃣ Encode the token and build the final link
        String link = baseUrl + URLEncoder.encode(plain, StandardCharsets.UTF_8);

        // 5️⃣ Send the reset email
        String subject = "Reset your Eventwisp password";
        String msg = "We received a request to reset your password.\n\n" +
                "Click the link below (valid for 20 minutes):\n" + link + "\n\n" +
                "If you didn’t request this, you can ignore this email.";
        mailService.sendEmail(email, subject, msg);
    }

    @Override
    public Boolean validateToken(String plain) {
        return findValidToken(plain).isPresent();
    }

    @Override
    public void resetPassword(String plain, String newPassword) {
        PasswordResetToken token = findValidToken(plain)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        switch (token.getUserType()) {
            case ADMIN -> adminRepository.findById(token.getUserId()).ifPresent(admin -> {
                admin.setPassword(passwordEncoder.encode(newPassword));
                adminRepository.save(admin);
            });
            case ORGANIZER -> organizerRepository.findById(token.getUserId()).ifPresent(org -> {
                org.setPassword(passwordEncoder.encode(newPassword));
                organizerRepository.save(org);
            });
            case MANAGER -> managerRepository.findById(token.getUserId()).ifPresent(mgr -> {
                mgr.setPassword(passwordEncoder.encode(newPassword));
                managerRepository.save(mgr);
            });
            default -> throw new IllegalStateException("Unsupported user type");
        }

        token.setUsed(true);
        passwordResetTokenRepository.save(token);

        // (Optional) email confirmation
        // mailService.sendEmail(userEmail, "Your password was changed", "If this wasn't you, contact support.");
    }

    //    helper methods
    private Optional<PasswordResetToken> findValidToken(String plain) {
        String tokenHash = sha256Hex(plain);
        return passwordResetTokenRepository.findByTokenHashAndUsedFalse(tokenHash)
                .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()));
    }

    private Optional<UserRef> findUserByEmail(String email) {
        // Try ADMIN
        var admin = adminRepository.findByEmail(email).orElse(null);
        if (admin != null) return Optional.of(new UserRef(admin.getId(), UserType.ADMIN));

        // Try ORGANIZER
        var org = organizerRepository.findByEmail(email).orElse(null);
        if (org != null) return Optional.of(new UserRef(org.getId(), UserType.ORGANIZER));

        // Try MANAGER
        var mgr = managerRepository.findByEmail(email).orElse(null);
        if (mgr != null) return Optional.of(new UserRef(mgr.getId(), UserType.MANAGER));

        return Optional.empty();
    }

    private static String sha256Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] out = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(out); // 64-char lowercase hex
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    private record UserRef(Long id, UserType type) {
    }
}
