package org.codefactory.team07.personalfinancialmanagement.domain.port.out;

import java.util.Optional;
import org.codefactory.team07.personalfinancialmanagement.domain.model.User;

public interface UserRepository {
    void save(User user);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
