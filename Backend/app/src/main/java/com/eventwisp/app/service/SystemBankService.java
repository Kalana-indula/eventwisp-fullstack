package com.eventwisp.app.service;

import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.entity.SystemBank;
import org.springframework.stereotype.Service;

@Service
public interface SystemBankService {

    //add a new bank to the system
    SystemBank addSystemBank(SystemBank systemBank);

    //get all bank details
    SingleEntityResponse<SystemBank> getAllSystemBankDetails();

    //update bank details
    SingleEntityResponse<SystemBank> updateSystemBankDetails(SystemBank systemBank);
}
