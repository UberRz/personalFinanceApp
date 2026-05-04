package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import org.codefactory.team07.personalfinancialmanagement.domain.model.User;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.UserRepository;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RegisterUserUseCase {
    private final UserRepository userRepository;

    public String execute(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        userRepository.save(user);
        return "Usuario registrado exitosamente";
    }
}