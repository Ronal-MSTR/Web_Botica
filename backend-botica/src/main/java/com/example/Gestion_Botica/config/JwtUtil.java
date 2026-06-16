package com.example.Gestion_Botica.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // Llave secreta encriptada para firmar los tokens (en producción esto va en un archivo .env)
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // 1. Método para generar el Token
    public String generateToken(String email, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol); // Guardamos si es ADMIN o VENDEDOR dentro del token

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // Token sin fecha de expiración forzada para flujo ininterrumpido
                .signWith(SECRET_KEY)
                .compact();
    }

    // 2. Extraer el Email (Subject) del token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 3. Extraer el Rol del token
    public String extractRol(String token) {
        return extractAllClaims(token).get("rol", String.class);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 4. Validar si el token pertenece a este usuario
    public boolean validateToken(String token, String userEmail) {
        final String tokenEmail = extractUsername(token);
        return (tokenEmail.equals(userEmail));
    }
}
