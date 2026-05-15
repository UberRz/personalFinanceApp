package org.codefactory.team07.personalfinancialmanagement.domain.model;

import java.time.LocalDateTime;

public class User {
    private final Long id;
    private final String email;
    private final String password;
    private final String name;
    private final LocalDateTime createdAt;

    public User(String email, String password, String name) {
        this(null, email, password, name, null);
    }

    // Constructor
    public User(Long id, String email, String password, String name, LocalDateTime createdAt) {
        if (email == null || email.isBlank())
            throw new IllegalArgumentException("El email es obligatorio");
        if (password == null || password.isBlank())
            throw new IllegalArgumentException("La contraseña es obligatoria");
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("El nombre es obligatorio");

        if (!isValidEmail(email))
            throw new IllegalArgumentException("El email no tiene un formato válido");

        if (!isValidPassword(password))
            throw new IllegalArgumentException(
                "La contraseña debe contener mayúsculas, minúsculas, números, símbolos y tener entre 8 y 10 caracteres");

        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.createdAt = createdAt;
    }

    private static boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    private static boolean isValidPassword(String password) {
        if (password.length() < 8 || password.length() > 10)
            return false;

        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasLower = password.matches(".*[a-z].*");
        boolean hasDigit = password.matches(".*\\d.*");
        boolean hasSymbol = password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>?/\\\\|`~].*");

        return hasUpper && hasLower && hasDigit && hasSymbol;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}