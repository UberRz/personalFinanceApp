package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String email;
}