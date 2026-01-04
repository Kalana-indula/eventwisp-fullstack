package com.eventwisp.app.service;

import com.eventwisp.app.dto.earning.MonthlyEarningDto;
import com.eventwisp.app.dto.earning.TotalEarningsPerMonthDto;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.entity.MonthlyEarning;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MonthlyEarningService {

    List<MonthlyEarning> findAllMonthlyEarnings();

    //find all monthly earnings by organizer sort by year
    MultipleEntityResponse<MonthlyEarningDto> findMonthlyEarningsByYear(Long organizerId, Integer year);

    //get all years
    MultipleEntityResponse<Integer> findAllFinancialYears();

    //get total earnings per each month per year
    MultipleEntityResponse<TotalEarningsPerMonthDto> findTotalEarningsPerMonthByYear(Integer year);
}
