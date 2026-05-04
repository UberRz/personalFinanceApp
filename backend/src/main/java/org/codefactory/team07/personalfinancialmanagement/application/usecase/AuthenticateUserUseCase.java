package org.codefactory.team07.personalfinancialmanagement.application.usecase;

import java.util.Optional;
import org.codefactory.team07.personalfinancialmanagement.domain.model.User;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.UserRepository;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthenticateUserUseCase {
    private final UserRepository userRepository;

    public User execute(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .orElseThrow(() -> new IllegalArgumentException("Las credenciales son incorrectas"));
    }
}