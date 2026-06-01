package org.codefactory.team07.personalfinancialmanagement.application.service;

import java.security.Key;
import java.util.Date;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtService {


    private static final String SECRET = "clave-super-secreta-de-al-menos-32-caracteres!!";
    

    private static final long EXPIRATION_MS = 86400000;


    private final Set<String> invalidatedTokens = ConcurrentHashMap.newKeySet();

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }


    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getKey())
                .compact();
    }

    public boolean isTokenValid(String token) {
        if (invalidatedTokens.contains(token)) return false;
        try {
            Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

  
    public void invalidateToken(String token) {
        invalidatedTokens.add(token);
    }
}