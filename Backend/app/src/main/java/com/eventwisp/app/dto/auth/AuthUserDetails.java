package com.eventwisp.app.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthUserDetails {
    private String authToken="";
    private Long userId;
    private String userName="";
    private String userRole="";
    private Boolean isApproved;
}
