package com.example.Gestion_Botica.repositories;

import com.example.Gestion_Botica.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Esto servirá para validar que no existan correos duplicados
    Optional<Usuario> findByEmail(String email);

    // NUEVO: Esto sirve para el Dashboard (Cuenta cuántos usuarios tienen activo = true)
    Long countByActivo(Boolean activo);
}
