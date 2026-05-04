package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.out.persistance;

import java.util.Optional;
import org.codefactory.team07.personalfinancialmanagement.domain.model.User;
import org.codefactory.team07.personalfinancialmanagement.domain.port.out.UserRepository;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    private final JpaUserRepository jpaRepository;

    @Override
    public void save(User user) {
        UserEntity entity = new UserEntity(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getName(),
                user.getCreatedAt()
        );
        jpaRepository.save(entity);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email)
                .map(entity -> new User(
                        entity.getId(),
                        entity.getEmail(),
                        entity.getPassword(),
                        entity.getName(),
                        entity.getCreatedAt()
                ));
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }
}