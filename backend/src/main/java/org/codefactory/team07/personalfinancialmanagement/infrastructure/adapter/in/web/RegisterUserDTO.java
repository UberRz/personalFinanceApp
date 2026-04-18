package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import lombok.Data;

@Data
public class RegisterUserDTO {
    private String email;
    private String password;
    private String name;
}
