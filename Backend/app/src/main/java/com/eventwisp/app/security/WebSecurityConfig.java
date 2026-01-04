package com.eventwisp.app.security;

import com.eventwisp.app.security.jwt.AuthEntryPoint;
import com.eventwisp.app.security.jwt.AuthTokenFilter;
import com.eventwisp.app.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    private UserDetailsServiceImpl userDetailsService;

    private AuthEntryPoint unauthorizedHandler;

    private JwtUtils jwtUtils;

    @Autowired
    public WebSecurityConfig(UserDetailsServiceImpl userDetailsService,
                             AuthEntryPoint unauthorizedHandler,
                             JwtUtils jwtUtils) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public UserDetailsService userDetailsService(){
        return userDetailsService;
    }

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        //since a parameterized constructor
        return new AuthTokenFilter(jwtUtils, userDetailsService);
    }

    //add a password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)throws Exception{
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)throws Exception{
        http.cors().and().csrf(csrf-> csrf.disable())
                .exceptionHandling(exception->exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth-> auth
//                        -------------API's required specific role based permission-------------
                        .requestMatchers("/api/auth/managers").permitAll()
                        .requestMatchers("/api/managers/assigned").hasRole("ADMIN")
                        .requestMatchers("/api//managers/assigned").hasRole("ADMIN")
                        .requestMatchers("/api/commission").hasRole("ADMIN")
                        .requestMatchers("/api/platform-balance").hasRole("ADMIN")
                        .requestMatchers("/api/system-banks").hasRole("ADMIN")
                        .requestMatchers("/api/transactions/id/*").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/api/organizers/*/password").hasAnyRole("ORGANIZER")
                        .requestMatchers("/api/organizers/*/email").hasAnyRole("ORGANIZER")
                        .requestMatchers("/api/organizers/*/contact").hasAnyRole("ORGANIZER")


//                        ----------Accessible endpoints-----------------
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/auth/organizers").permitAll()
                        .requestMatchers("/api/categories").permitAll()
                        .requestMatchers("/api/events/sessions/latest").permitAll()
                        .requestMatchers("/api/events/**").permitAll()
                        .requestMatchers("/api/sessions").permitAll()
                        .requestMatchers("/api/sessions/**").permitAll()
                        .requestMatchers("/api/bookings").permitAll()
                        .requestMatchers("/api/emails/booking-confirmation").permitAll()
                        .requestMatchers("/api/payments/create-intent").permitAll()
                        .anyRequest().authenticated());

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
