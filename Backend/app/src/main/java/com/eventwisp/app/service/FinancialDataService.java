package com.eventwisp.app.service;

import com.eventwisp.app.dto.finance.CommissionUpdate;
import com.eventwisp.app.dto.finance.UpdateBalance;
import com.eventwisp.app.dto.response.general.SingleEntityResponse;
import com.eventwisp.app.entity.FinancialData;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public interface FinancialDataService {

    FinancialData addInitialData(FinancialData financialData);

    SingleEntityResponse<Double> getCommission();

    SingleEntityResponse<BigDecimal> getBalance();

    SingleEntityResponse<Double> updateCommission(CommissionUpdate commissionUpdate);

    SingleEntityResponse<BigDecimal> updateBalance(UpdateBalance updateBalance);
}
