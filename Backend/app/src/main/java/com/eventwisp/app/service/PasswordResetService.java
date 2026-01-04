package com.eventwisp.app.service;

import org.springframework.stereotype.Service;

@Service
public interface PasswordResetService {

    void requestReset(String email);

    Boolean validateToken(String plain);

    void resetPassword(String plain,String newPassword);

}
