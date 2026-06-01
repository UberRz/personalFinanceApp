package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import org.codefactory.team07.personalfinancialmanagement.application.service.JwtService;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.AuthenticateUserUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticateUserUseCase authenticateUserUseCase;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginUserDTO dto) {
        if (!isValidEmail(dto.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("El email no tiene un formato válido", false));
        }
        try {
            String token = authenticateUserUseCase.execute(dto.getEmail(), dto.getPassword());
            AuthResponseDTO response = new AuthResponseDTO(token, dto.getEmail());
            return ResponseEntity.ok(new ApiResponse("Inicio de sesión exitoso", true, response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Token no proporcionado", false));
        }

        String token = authHeader.substring(7);
        jwtService.invalidateToken(token);
        return ResponseEntity.ok(new ApiResponse("Sesión cerrada exitosamente", true));
    }

    private boolean isValidEmail(String email) {
        if (email == null) return false;
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");
    }
}