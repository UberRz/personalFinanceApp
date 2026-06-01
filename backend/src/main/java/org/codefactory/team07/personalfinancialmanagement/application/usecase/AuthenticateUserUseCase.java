package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.application.service.JwtService;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.UserRepository;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthenticateUserUseCase {

    private final UserRepository userRepository;
    private final JwtService jwtService; 

    public String execute(String email, String password) {
        // 1. Busca el usuario y verifica la contraseña
        userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .orElseThrow(() -> new IllegalArgumentException("Las credenciales son incorrectas"));

        // 2. Si es válido, genera y retorna el token
        return jwtService.generateToken(email);
    }
}