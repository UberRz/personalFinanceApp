package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import org.codefactory.team07.personalfinancialmanagement.application.usecase.AuthenticateUserUseCase;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.RegisterUserUseCase;
import org.codefactory.team07.personalfinancialmanagement.domain.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {
    private final RegisterUserUseCase registerUserUseCase;
    private final AuthenticateUserUseCase authenticateUserUseCase;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterUserDTO dto) {
        try {
            if (dto.getEmail() == null || dto.getEmail().isBlank()) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Error en los datos: el email es obligatorio", false));
            }
            if (dto.getPassword() == null || dto.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Error en los datos: la contraseña es obligatoria", false));
            }
            if (dto.getName() == null || dto.getName().isBlank()) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Error en los datos: el nombre es obligatorio", false));
            }

            User user = new User(dto.getEmail(), dto.getPassword(), dto.getName());
            String result = registerUserUseCase.execute(user);
            return ResponseEntity.status(201).body(
                    new ApiResponse(result, true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse("Error: " + e.getMessage(), false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginUserDTO dto) {
        try {
            if (dto.getEmail() == null || dto.getEmail().isBlank()) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Error en los datos: el email es obligatorio", false));
            }
            if (dto.getPassword() == null || dto.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Error en los datos: la contraseña es obligatoria", false));
            }

            User user = authenticateUserUseCase.execute(dto.getEmail(), dto.getPassword());
            return ResponseEntity.ok(
                    new ApiResponse("Inicio de sesión exitoso", true, user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse("Error: " + e.getMessage(), false));
        }
    }
}
