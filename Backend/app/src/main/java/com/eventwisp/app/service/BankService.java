package com.eventwisp.app.service;

import com.eventwisp.app.dto.bank.AddBankDto;
import com.eventwisp.app.dto.bank.BankDetailsDto;
import com.eventwisp.app.dto.bank.UpdateBankDto;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import org.springframework.stereotype.Service;

@Service
public interface BankService {

    //create new bank details entity
    SingleEntityResponse<BankDetailsDto> addBank(AddBankDto addBankDto);

    //get bank details by organizer
    SingleEntityResponse<BankDetailsDto> findBankByOrganizer(Long organizerId);

    //update bank details
    SingleEntityResponse<BankDetailsDto> findBankByBankId(Long organizerId, UpdateBankDto updateBankDto);
}
