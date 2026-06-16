package com.example.Gestion_Botica.repositories;

import com.example.Gestion_Botica.entities.DevolucionProveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DevolucionProveedorRepository extends JpaRepository<DevolucionProveedor, Integer> {
}