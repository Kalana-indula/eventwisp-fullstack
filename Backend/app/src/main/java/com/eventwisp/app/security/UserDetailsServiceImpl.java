package com.eventwisp.app.security;

import com.eventwisp.app.entity.Admin;
import com.eventwisp.app.entity.Manager;
import com.eventwisp.app.entity.Organizer;
import com.eventwisp.app.repository.AdminRepository;
import com.eventwisp.app.repository.ManagerRepository;
import com.eventwisp.app.repository.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final OrganizerRepository organizerRepository;
    private final AdminRepository adminRepository;
    private final ManagerRepository managerRepository;

    @Autowired
    public UserDetailsServiceImpl(OrganizerRepository organizerRepository,
                                  AdminRepository adminRepository,
                                  ManagerRepository managerRepository) {
        this.organizerRepository = organizerRepository;
        this.adminRepository = adminRepository;
        this.managerRepository = managerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Normalize email
        String normalizedEmail = email.trim().toLowerCase();

        //  Check organizer
        Organizer organizer = organizerRepository.findByEmail(normalizedEmail).orElse(null);
        if (organizer != null) {
            return User.withUsername(organizer.getEmail())
                    .password(organizer.getPassword())
                    .authorities(new SimpleGrantedAuthority("ROLE_ORGANIZER"))
                    .build();
        }

        //  Check admin
        Admin admin = adminRepository.findByEmail(normalizedEmail).orElse(null);
        if (admin != null) {
            return User.withUsername(admin.getEmail())
                    .password(admin.getPassword())
                    .authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))
                    .build();
        }

        // 3 Check manager
        Manager manager = managerRepository.findByEmail(normalizedEmail).orElse(null);
        if (manager != null) {
            return User.withUsername(manager.getEmail())
                    .password(manager.getPassword())
                    .authorities(new SimpleGrantedAuthority("ROLE_MANAGER"))
                    .build();
        }

        // If none found
        throw new UsernameNotFoundException("No user found for email: " + email);
    }
}
