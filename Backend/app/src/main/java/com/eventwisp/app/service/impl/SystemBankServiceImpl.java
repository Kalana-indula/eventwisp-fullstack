package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.entity.SystemBank;
import com.eventwisp.app.repository.SystemBankRepository;
import com.eventwisp.app.service.SystemBankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SystemBankServiceImpl implements SystemBankService {

    private SystemBankRepository systemBankRepository;

    @Autowired
    public SystemBankServiceImpl(SystemBankRepository systemBankRepository) {
        this.systemBankRepository = systemBankRepository;
    }

    //add a new bank for platform
    @Override
    @Transactional
    public SystemBank addSystemBank(SystemBank systemBank) {
        List<SystemBank> existingBanks = systemBankRepository.findAll();

        if (!existingBanks.isEmpty()) {
            // Update the existing bank details
            SystemBank existing = existingBanks.get(0);
            existing.setBankName(systemBank.getBankName());
            existing.setAccountHolderName(systemBank.getAccountHolderName());
            existing.setBranchName(systemBank.getBranchName());
            existing.setAccountNumber(systemBank.getAccountNumber());

            return systemBankRepository.save(existing);
        }

        // If no bank exists, save the new one
        return systemBankRepository.save(systemBank);
    }


    //get current bank details
    @Override
    public SingleEntityResponse<SystemBank> getAllSystemBankDetails() {

        SingleEntityResponse<SystemBank> response = new SingleEntityResponse<>();

        List<SystemBank> systemBanks = systemBankRepository.findAll();

        if (systemBanks.isEmpty()) {
            response.setMessage("No bank details were found");
            response.setEntityData(null);
        } else {
            response.setMessage("System bank details fetched successfully");
            response.setEntityData(systemBanks.get(0)); // Always the first row
        }

        return response;
    }

    @Override
    @Transactional
    public SingleEntityResponse<SystemBank> updateSystemBankDetails(SystemBank systemBank) {

        SingleEntityResponse<SystemBank> response = new SingleEntityResponse<>();

        /* There is only ONE bank row in the table */
        List<SystemBank> banks = systemBankRepository.findAll();

        if (banks.isEmpty()) {
            response.setMessage("No bank record exists to update");
            response.setEntityData(null);
            return response;
        }

        SystemBank existing = banks.get(0);

        /* Update the four fields sent from the client */
        existing.setBankName(systemBank.getBankName());
        existing.setAccountHolderName(systemBank.getAccountHolderName());
        existing.setBranchName(systemBank.getBranchName());
        existing.setAccountNumber(systemBank.getAccountNumber());

        SystemBank updated = systemBankRepository.save(existing);

        response.setMessage("Bank details updated successfully");
        response.setEntityData(updated);
        return response;
    }

}
