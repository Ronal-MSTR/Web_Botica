package com.example.Gestion_Botica.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Angular siempre enviará el token en la cabecera "Authorization"
        final String authorizationHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;

        // 2. Si la cabecera existe y empieza con "Bearer ", extraemos el token
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                email = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                System.out.println("Error extrayendo el token: " + e.getMessage());
            }
        }

        // 3. Si encontramos un correo y el usuario aún no está autenticado en este hilo
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Validamos que el token no haya sido alterado
            if (jwtUtil.validateToken(jwt, email)) {
                // Creamos un usuario temporal en memoria para esta petición
                UserDetails userDetails = new User(email, "", new ArrayList<>());
                
                UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Le decimos a Spring: "Este usuario está autenticado, déjalo pasar"
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Continuar con el flujo normal de la petición
        filterChain.doFilter(request, response);
    }
}
