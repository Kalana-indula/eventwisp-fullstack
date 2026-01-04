package com.eventwisp.app.security.jwt;

import com.eventwisp.app.security.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//Filter all the request made by the user
@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private JwtUtils jwtUtils;

    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    public AuthTokenFilter(JwtUtils jwtUtils,
                           UserDetailsServiceImpl userDetailsService) {

        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;

    }

    public AuthTokenFilter(){

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            String jwt=parseJwt(request);

            //check if the token is not null and is valid
            if((jwt !=null) && (jwtUtils.validateJwtToken(jwt))){

                //get the email from token
                String email=jwtUtils.getUsernameFromJwtToken(jwt); //since 'email' is considered as username

                //get user details from extracted username
                UserDetails userDetails=userDetailsService.loadUserByUsername(email);

                //create an authentication object
                //in this case 'credentials' are provided within 'userDetails'
                UsernamePasswordAuthenticationToken authentication=new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                //set details for authentication as matches to request
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                //indicate to the security context holder that user is successfully authenticated
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }catch(Exception e){
            System.err.println("Cannot set user auth");
        }

        filterChain.doFilter(request,response);
    }

    //filter the token from header
    private String parseJwt(HttpServletRequest request){
        String authHeader=request.getHeader("Authorization");

        if(StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")){
            return authHeader.substring(7);
        }

        return null;
    }
}
