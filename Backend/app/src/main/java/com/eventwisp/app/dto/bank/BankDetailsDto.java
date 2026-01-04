package com.eventwisp.app.dto.bank;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BankDetailsDto {
    private Long id;
    private String organizerName;
    private String accountHolderName;
    private String bankName;
    private String bankAccountNumber;
    private String branchName;
}
