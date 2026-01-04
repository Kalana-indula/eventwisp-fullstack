package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.finance.CommissionUpdate;
import com.eventwisp.app.dto.finance.UpdateBalance;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.entity.FinancialData;
import com.eventwisp.app.repository.FinancialDataRepository;
import com.eventwisp.app.service.FinancialDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FinancialDataServiceImpl implements FinancialDataService {

    private FinancialDataRepository financialDataRepository;

    @Autowired
    public FinancialDataServiceImpl(FinancialDataRepository financialDataRepository) {
        this.financialDataRepository = financialDataRepository;
    }

    //add initial data
    @Override
    public FinancialData addInitialData(FinancialData financialData) {

        List<FinancialData> existingFinancialData = financialDataRepository.findAll();

        if(!existingFinancialData.isEmpty()) {
            //update existing data
            FinancialData existing=existingFinancialData.get(0);
            existing.setCommission(financialData.getCommission());
            existing.setPlatformBalance(financialData.getPlatformBalance());

            return financialDataRepository.save(existing);
        }

        return financialDataRepository.save(financialData);
    }

    @Override
    public SingleEntityResponse<Double> getCommission() {

        SingleEntityResponse<Double> response = new SingleEntityResponse<>();

        List<FinancialData> financialData = financialDataRepository.findAll();

        if(financialData.isEmpty()){
            response.setMessage("No data was found");
            response.setEntityData(null);
        }else {
            response.setMessage("System financial data fetched successfully");
            response.setEntityData(financialData.get(0).getCommission());
        }

        return response;
    }

    @Override
    public SingleEntityResponse<BigDecimal> getBalance() {

        SingleEntityResponse<BigDecimal> response = new SingleEntityResponse<>();

        List<FinancialData> financialData = financialDataRepository.findAll();

        if(financialData.isEmpty()){
            response.setMessage("No data was found");
            response.setEntityData(null);
        }else {
            response.setMessage("System financial data fetched successfully");
            response.setEntityData(financialData.get(0).getPlatformBalance());
        }

        return response;
    }

    @Override
    public SingleEntityResponse<Double> updateCommission(CommissionUpdate commissionUpdate) {
        SingleEntityResponse<Double> response = new SingleEntityResponse<>();

        List<FinancialData> financialData = financialDataRepository.findAll();

        if (financialData.isEmpty()) {
            response.setMessage("No data was found");
            response.setEntityData(null);
            return response;
        }

        FinancialData existing = financialData.get(0);
        existing.setCommission(commissionUpdate.getCommission());
        FinancialData updated = financialDataRepository.save(existing);

        response.setMessage("New Commission: " + updated.getCommission());
        response.setEntityData(updated.getCommission());
        return response;
    }

    @Override
    public SingleEntityResponse<BigDecimal> updateBalance(UpdateBalance updateBalance) {
        SingleEntityResponse<BigDecimal> response = new SingleEntityResponse<>();

        List<FinancialData> financialData = financialDataRepository.findAll();

        if (financialData.isEmpty()) {
            response.setMessage("No data was found");
            response.setEntityData(null);
            return response;
        }

        FinancialData existing = financialData.get(0);
        existing.setPlatformBalance(updateBalance.getBalance());
        FinancialData updated = financialDataRepository.save(existing);

        response.setMessage("New Balance: " + updated.getPlatformBalance());
        response.setEntityData(updated.getPlatformBalance());
        return response;
    }


}
