package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in;

import org.codefactory.team07.personalfinancialmanagement.application.usecase.AuthenticateUserUseCase;
import org.codefactory.team07.personalfinancialmanagement.domain.model.User;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.ApiResponse;
import org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web.LoginUserDTO;
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
        try {
            User user = authenticateUserUseCase.execute(dto.getEmail(), dto.getPassword());
            return ResponseEntity.ok(new ApiResponse("Inicio de sesión exitoso", true, user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), false));
        }
    }
}