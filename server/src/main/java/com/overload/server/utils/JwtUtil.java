package com.overload.server.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // Converts plain text secret key into a cryptographic key object so JJWT can use to sign and verify tokens
    private SecretKey getSigningKey() {
        // converts secret into raw bytes then creates a digital signature for JWT
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, String role, Long id) {
        return Jwts.builder()
                .subject(email) // stores the email inside the token to see who it belongs to
                // stores the role as "ROLE_TRAINER" or "ROLE_CLIENT" to verify if they have access to certain endpoints
                .claim("role", role)
                .claim("id", id)
                .issuedAt(new Date()) // timestamp of when token was created
                .expiration(new Date(System.currentTimeMillis() + expiration)) // current time + expiration time
                .signWith(getSigningKey()) // signs token with the secret so it cannot be tampered with
                .compact(); // compacts everything into one JWT string
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey()) // Verifies the token's signature was not tampered with
                .build()
                .parseSignedClaims(token) // decodes the JWT string
                .getPayload(); // extracts the Claims object (everything stored in the token)
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public Long extractId(String token) {
        return parseClaims(token).get("id", Long.class);
    }

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        }
        catch (Exception e) {
            System.out.println("JWT validation failed: " + e.getMessage());
            return false;
        }
    }
}
