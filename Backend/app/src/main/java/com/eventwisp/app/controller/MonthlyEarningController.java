package com.eventwisp.app.controller;

import com.eventwisp.app.dto.earning.MonthlyEarningDto;
import com.eventwisp.app.dto.earning.TotalEarningsPerMonthDto;
import com.eventwisp.app.dto.response.general.MultipleEntityResponse;
import com.eventwisp.app.service.MonthlyEarningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class MonthlyEarningController {

    private MonthlyEarningService monthlyEarningService;

    @Autowired
    public MonthlyEarningController(MonthlyEarningService monthlyEarningService) {
        this.monthlyEarningService = monthlyEarningService;
    }

    //get all monthly earnings
    @GetMapping("/monthly-earnings")
    public ResponseEntity<?> findAllMonthlyEarnings() {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(monthlyEarningService.findAllMonthlyEarnings());
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //get monthly earnings sorted by year
    @GetMapping("/monthly-earnings/organizers/{organizerId}/{year}")
    public ResponseEntity<?> findMonthlyEarningsByYear(@PathVariable Long organizerId,@PathVariable Integer year){

        try {
            MultipleEntityResponse<MonthlyEarningDto> response=monthlyEarningService.findMonthlyEarningsByYear(organizerId,year);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //get all years with financial records
    @GetMapping("/monthly-earnings/years")
    public ResponseEntity<?> findAllFinancialYears(){
        try {
            MultipleEntityResponse<Integer> response=monthlyEarningService.findAllFinancialYears();

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //get all total monthly earnings per yaer
    @GetMapping("/monthly-earnings/total/{year}")
    public ResponseEntity<?> findTotalMonthlyEarningsByYear(@PathVariable Integer year) {
        try {
            MultipleEntityResponse<TotalEarningsPerMonthDto> response = monthlyEarningService.findTotalEarningsPerMonthByYear(year);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
