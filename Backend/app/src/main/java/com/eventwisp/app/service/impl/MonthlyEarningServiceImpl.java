package com.eventwisp.app.service.impl;

import com.eventwisp.app.dto.earning.MonthlyEarningDto;
import com.eventwisp.app.dto.earning.TotalEarningsPerMonthDto;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.entity.MonthlyEarning;
import com.eventwisp.app.repository.MonthlyEarningRepository;
import com.eventwisp.app.service.MonthlyEarningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MonthlyEarningServiceImpl implements MonthlyEarningService {

    private MonthlyEarningRepository monthlyEarningRepository;

    @Autowired
    public MonthlyEarningServiceImpl(MonthlyEarningRepository monthlyEarningRepository) {
        this.monthlyEarningRepository = monthlyEarningRepository;
    }

    //find all earnings
    @Override
    public List<MonthlyEarning> findAllMonthlyEarnings() {
        return monthlyEarningRepository.findAll();
    }

    //find monthly earnings sorted by year and organizer
    @Override
    public MultipleEntityResponse<MonthlyEarningDto> findMonthlyEarningsByYear(Long organizerId, Integer year) {

        MultipleEntityResponse<MonthlyEarningDto> response = new MultipleEntityResponse<>();

        List<MonthlyEarning> monthlyEarningList = monthlyEarningRepository.findByOrganizerAndYear(organizerId, year);

        if (monthlyEarningList == null || monthlyEarningList.isEmpty()) {
            response.setEntityList(new ArrayList<>());
            response.setMessage("No earning records found");
            response.setRemarks("Entities count : 0");
            return response;
        }

        List<MonthlyEarningDto> dtoList = new ArrayList<>();

        for (MonthlyEarning me : monthlyEarningList) {
            MonthlyEarningDto dto = new MonthlyEarningDto();
            dto.setId(me.getId());
            dto.setMonthNumber(me.getMonthNumber());
            dto.setMonthName(me.getMonthName());
            dto.setYear(me.getYear());
            dto.setTotalEarnings(me.getTotalEarnings());
            dto.setOrganizerId(me.getOrganizer().getId());

            dtoList.add(dto);
        }

        response.setEntityList(dtoList);
        response.setMessage("Monthly Earning Details for organizer : " + organizerId);
        response.setRemarks("Entities count : " + dtoList.size());

        return response;
    }

    //find all financial years
    @Override
    public MultipleEntityResponse<Integer> findAllFinancialYears() {

        MultipleEntityResponse<Integer> response= new MultipleEntityResponse<>();

        //fetch years list
        List<Integer> yearsList=monthlyEarningRepository.findAllYears();

        if(yearsList==null || yearsList.isEmpty()){
            response.setEntityList(new ArrayList<>());
            response.setMessage("No earning records found");
            response.setRemarks("Entities count : 0");

            return response;
        }

        response.setEntityList(yearsList);
        response.setMessage("Financial years count : " + yearsList.size());
        response.setRemarks("Financial years count : " + yearsList.size());

        return response;
    }

    //find total earnings per month by year
    @Override
    public MultipleEntityResponse<TotalEarningsPerMonthDto> findTotalEarningsPerMonthByYear(Integer year) {

        MultipleEntityResponse<TotalEarningsPerMonthDto> response = new MultipleEntityResponse<>();

        //fetch monthly earnings by year
        List<MonthlyEarning> monthlyEarnings=monthlyEarningRepository.findMonthlyEarningsByYear(year);

        if(monthlyEarnings==null || monthlyEarnings.isEmpty()){
            response.setEntityList(new ArrayList<>());
            response.setMessage("No earning records found");
            response.setRemarks("Entities count : 0");

            return response;
        }

        // Group by monthNumber and sum totalEarnings
        Map<Integer, BigDecimal> monthlyTotals = monthlyEarnings.stream()
                .collect(Collectors.groupingBy(
                        MonthlyEarning::getMonthNumber,
                        Collectors.reducing(BigDecimal.ZERO, MonthlyEarning::getTotalEarnings, BigDecimal::add)
                ));

        // Get unique month names (assuming consistent monthName for monthNumber)
        Map<Integer, String> monthNames = monthlyEarnings.stream()
                .collect(Collectors.toMap(
                        MonthlyEarning::getMonthNumber,
                        MonthlyEarning::getMonthName,
                        (existing, replacement) -> existing // Keep first
                ));

        // Create DTO list
        List<TotalEarningsPerMonthDto> dtoList = new ArrayList<>();
        for (Map.Entry<Integer, BigDecimal> entry : monthlyTotals.entrySet()) {
            Integer monthNum = entry.getKey();
            TotalEarningsPerMonthDto dto = new TotalEarningsPerMonthDto();
            dto.setYear(year);
            dto.setMonthNumber(monthNum);
            dto.setMonthName(monthNames.get(monthNum));
            dto.setTotalEarnings(entry.getValue());
            dtoList.add(dto);
        }

        // Sort by monthNumber
        dtoList.sort(Comparator.comparing(TotalEarningsPerMonthDto::getMonthNumber));

        response.setEntityList(dtoList);
        response.setMessage("Total Monthly Earnings for year " + year);
        response.setRemarks("Months count : " + dtoList.size());

        return response;
    }
}
