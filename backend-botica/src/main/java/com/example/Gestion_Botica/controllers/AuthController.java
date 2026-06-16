package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.dto.LoginRequest;
import com.example.Gestion_Botica.config.JwtUtil;
import com.example.Gestion_Botica.entities.Usuario;
import com.example.Gestion_Botica.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 1. Buscamos al usuario por correo
            Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Correo o contraseña incorrectos"));

            // 2. Verificamos que esté activo
            if (!usuario.getActivo()) {
                throw new RuntimeException("Este usuario ha sido dado de baja del sistema");
            }

            // 3. Comparamos las contraseñas encriptadas
            if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword_hash())) {
                throw new RuntimeException("Correo o contraseña incorrectos");
            }

            // 4. Generamos el Token JWT incluyendo su Rol
            String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().getNombre());

            // 5. Enviamos la respuesta a Angular
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("usuario", usuario.getNombre_completo());
            response.put("rol", usuario.getRol().getNombre());
            response.put("usuarioId", usuario.getUsuario_id());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
