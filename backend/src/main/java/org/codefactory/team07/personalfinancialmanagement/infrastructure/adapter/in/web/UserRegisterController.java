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
        // Validar email manualmente
        if (!isValidEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiResponse("El email no tiene un formato válido", false));
        }

        try {
            User user = new User(dto.getEmail(), dto.getPassword(), dto.getName());
            String result = registerUserUseCase.execute(user);
            return ResponseEntity.status(201).body(new ApiResponse(result, true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), false));
        }
    }

    private boolean isValidEmail(String email) {
    if (email == null) return false;
    // Regex corregido para Java
    return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");

    }
}