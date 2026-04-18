package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import lombok.Data;

@Data
public class LoginUserDTO {
    private String email;
    private String password;
}
