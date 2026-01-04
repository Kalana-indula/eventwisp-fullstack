package com.eventwisp.app.dto.bank;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddBankDto {

    private Long organizerId;
    private String bankName;
    private String accountHolderName;
    private String branchName;
    private String accountNumber;
}
