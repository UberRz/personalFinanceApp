package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import lombok.RequiredArgsConstructor;
import org.codefactory.team07.personalfinancialmanagement.domain.model.User;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.UserRepository;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final JpaUserRepository jpaUserRepository;

    @Override
    public void save(User user) {
        UserEntity entity = new UserEntity();
        entity.setName(user.getName());
        entity.setEmail(user.getEmail());
        entity.setPassword(user.getPassword());
        jpaUserRepository.save(entity);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email)
            .map(entity -> new User(
                entity.getId(),
                entity.getEmail(),    // 2. Primero el email
                entity.getPassword(), // 3. Luego el password
                entity.getName(),     // 4. Después el nombre
                entity.getCreatedAt()
            ));
    }
    @Override
    public boolean existsByEmail(String email) {
        return jpaUserRepository.findByEmail(email).isPresent();
    }
}