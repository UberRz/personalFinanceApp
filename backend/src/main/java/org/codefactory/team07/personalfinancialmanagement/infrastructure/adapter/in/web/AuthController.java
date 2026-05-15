package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import org.codefactory.team07.personalfinancialmanagement.application.usecase.AuthenticateUserUseCase;
import org.codefactory.team07.personalfinancialmanagement.domain.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth/login")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticateUserUseCase authenticateUserUseCase;

    @PostMapping
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginUserDTO dto) {
        // Validar email manualmente
        if (!isValidEmail(dto.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiResponse("El email no tiene un formato válido", false));
        }

        try {
            User user = authenticateUserUseCase.execute(dto.getEmail(), dto.getPassword());
            return ResponseEntity.ok(new ApiResponse("Inicio de sesión exitoso", true, user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), false));
        }
    }

    private boolean isValidEmail(String email) {
    if (email == null) return false;
    return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");

    }
}