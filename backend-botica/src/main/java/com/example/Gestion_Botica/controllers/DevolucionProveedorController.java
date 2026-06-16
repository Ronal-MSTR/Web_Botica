package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.dto.DevolucionProvRequest;
import com.example.Gestion_Botica.entities.DevolucionProveedor;
import com.example.Gestion_Botica.services.DevolucionProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devoluciones-proveedor")
@CrossOrigin(origins = "http://localhost:4200")
public class DevolucionProveedorController {

    @Autowired
    private DevolucionProveedorService devProvService;

    @PostMapping("/procesar")
    public ResponseEntity<?> procesarDevolucion(@RequestBody DevolucionProvRequest request) {
        try {
            DevolucionProveedor nuevaDevolucion = devProvService.procesarDevolucionProveedor(request);
            return ResponseEntity.ok(nuevaDevolucion);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error en devolución a proveedor: " + e.getMessage());
        }
    }
}
