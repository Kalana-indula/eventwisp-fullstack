package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.bank.AddBankDto;
import com.eventwisp.app.dto.bank.BankDetailsDto;
import com.eventwisp.app.dto.bank.UpdateBankDto;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.entity.Bank;
import com.eventwisp.app.entity.Organizer;
import com.eventwisp.app.repository.BankRepository;
import com.eventwisp.app.repository.OrganizerRepository;
import com.eventwisp.app.service.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BankServiceImpl implements BankService {

    private BankRepository bankRepository;

    private OrganizerRepository organizerRepository;

    @Autowired
    public BankServiceImpl(BankRepository bankRepository,
                           OrganizerRepository organizerRepository) {
        this.bankRepository = bankRepository;
        this.organizerRepository = organizerRepository;
    }

    //add bank details
    @Override
    public SingleEntityResponse<BankDetailsDto> addBank(AddBankDto addBankDto) {

        SingleEntityResponse<BankDetailsDto> response = new SingleEntityResponse<>();

        Organizer existingOrganizer = organizerRepository.findById(addBankDto.getOrganizerId()).orElse(null);

        //check if organizer exists
        if(existingOrganizer == null) {
            response.setMessage("Organizer not found");
            return response;
        }

        //new bank object
        Bank bank = new Bank();

        bank.setBankName(addBankDto.getBankName());
        bank.setAccountHolderName(addBankDto.getAccountHolderName());
        bank.setBranchName(addBankDto.getBranchName());
        bank.setAccountNumber(addBankDto.getAccountNumber());
        bank.setOrganizer(existingOrganizer);

        Bank savedBank= bankRepository.save(bank);

        //details dto
        BankDetailsDto bankDetails=new BankDetailsDto();

        bankDetails.setId(savedBank.getId());
        bankDetails.setBankName(savedBank.getBankName());
        bankDetails.setOrganizerName(existingOrganizer.getCompanyName());
        bankDetails.setAccountHolderName(savedBank.getAccountHolderName());
        bankDetails.setBranchName(savedBank.getBranchName());
        bankDetails.setBankAccountNumber(savedBank.getAccountNumber());

        response.setMessage("Bank added successfully");
        response.setEntityData(bankDetails);

        return response;
    }

    @Override
    public SingleEntityResponse<BankDetailsDto> findBankByOrganizer(Long organizerId) {

        SingleEntityResponse<BankDetailsDto> response = new SingleEntityResponse<>();

        Organizer organizer = organizerRepository.findById(organizerId).orElse(null);

        if(organizer == null) {
            response.setMessage("Organizer not found");
            return response;
        }

        Bank existingBank=bankRepository.findByOrganizer(organizerId);

        if(existingBank==null){
            response.setMessage("Bank not found");
            return response;
        }

        BankDetailsDto bankDetails=new BankDetailsDto();

        bankDetails.setId(existingBank.getId());
        bankDetails.setBankName(existingBank.getBankName());
        bankDetails.setOrganizerName(organizer.getCompanyName());
        bankDetails.setAccountHolderName(existingBank.getAccountHolderName());
        bankDetails.setBranchName(existingBank.getBranchName());
        bankDetails.setBankAccountNumber(existingBank.getAccountNumber());

        response.setMessage("Bank details for organizer : "+organizer.getCompanyName());
        response.setEntityData(bankDetails);

        return response;
    }


    @Override
    public SingleEntityResponse<BankDetailsDto> findBankByBankId(Long organizerId, UpdateBankDto updateBankDto) {

        SingleEntityResponse<BankDetailsDto> response = new SingleEntityResponse<>();

        Organizer organizer = organizerRepository.findById(organizerId).orElse(null);

        if(organizer == null) {
            response.setMessage("Organizer not found");
            return response;
        }

        Bank existingBank=bankRepository.findByOrganizer(organizerId);

        if(existingBank==null){
            response.setMessage("Bank not found");
            return response;
        }

        existingBank.setBankName(updateBankDto.getBankName());
        existingBank.setAccountHolderName(updateBankDto.getAccountHolderName());
        existingBank.setBranchName(updateBankDto.getBranchName());
        existingBank.setAccountNumber(updateBankDto.getAccountNumber());

        Bank updatedBank=bankRepository.save(existingBank);

        BankDetailsDto bankDetails=new BankDetailsDto();

        bankDetails.setId(updatedBank.getId());
        bankDetails.setOrganizerName(updatedBank.getOrganizer().getCompanyName());
        bankDetails.setAccountHolderName(updatedBank.getAccountHolderName());
        bankDetails.setBankName(updateBankDto.getBankName());
        bankDetails.setBankAccountNumber(updatedBank.getAccountNumber());
        bankDetails.setBranchName(updatedBank.getBranchName());

        response.setMessage("Bank details updated successfully for organizer : "+organizer.getCompanyName());
        response.setEntityData(bankDetails);

        return response;
    }


}
