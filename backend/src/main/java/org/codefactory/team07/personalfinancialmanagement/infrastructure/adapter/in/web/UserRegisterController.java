package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import org.codefactory.team07.personalfinancialmanagement.application.usecase.RegisterUserUseCase;
import org.codefactory.team07.personalfinancialmanagement.domain.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth/register")
@RequiredArgsConstructor
public class UserRegisterController {
    private final RegisterUserUseCase registerUserUseCase;

    @PostMapping
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterUserDTO dto) {
        try {
            User user = new User(dto.getEmail(), dto.getPassword(), dto.getName());
            String result = registerUserUseCase.execute(user);
            return ResponseEntity.status(201).body(new ApiResponse(result, true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), false));
        }
    }
}