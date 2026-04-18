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
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new IllegalArgumentException("Las credenciales son incorrectas");
        }

        // Validar contraseña (en producción, usar bcrypt)
        if (!user.get().getPassword().equals(password)) {
            throw new IllegalArgumentException("Las credenciales son incorrectas");
        }

        return user.get();
    }
}
