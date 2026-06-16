package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.dto.CompraRequest;
import com.example.Gestion_Botica.entities.Compra;
import com.example.Gestion_Botica.entities.DetalleCompra;
import com.example.Gestion_Botica.repositories.CompraRepository;
import com.example.Gestion_Botica.repositories.DetalleCompraRepository;
import com.example.Gestion_Botica.services.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/compras")
@CrossOrigin(origins = "http://localhost:4200")
public class CompraController {

    @Autowired
    private CompraService compraService;

    // Repositorios agregados para el buscador
    @Autowired private CompraRepository compraRepository;
    @Autowired private DetalleCompraRepository detalleCompraRepository;

    @PostMapping("/registrar")
    public ResponseEntity<Compra> registrarCompra(@RequestBody CompraRequest request) {
        Compra nuevaCompra = compraService.registrarCompraCompleta(request);
        return ResponseEntity.ok(nuevaCompra);
    }

    // ==========================================
    // NUEVO: BUSCADOR DE FACTURA PARA DEVOLUCIONES
    // ==========================================
    @GetMapping("/buscar/{nroFactura}")
    public ResponseEntity<?> buscarCompraPorFactura(@PathVariable String nroFactura) {
        try {
            // Buscamos ignorando nulos y limpiando espacios
            Compra compra = compraRepository.findAll().stream()
                    .filter(c -> c.getNroFactura() != null && 
                                 c.getNroFactura().trim().equalsIgnoreCase(nroFactura.trim()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No se encontró la factura en BD: " + nroFactura));

            List<DetalleCompra> detalles = detalleCompraRepository.findAll().stream()
                    .filter(d -> d.getCompra().getCompra_id().equals(compra.getCompra_id()))
                    .collect(Collectors.toList());

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("compra", compra);
            respuesta.put("detalles", detalles);

            return ResponseEntity.ok(respuesta);
            
        } catch (Exception e) {
            e.printStackTrace(); // Esto imprimirá el error real en tu consola de VS Code
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
