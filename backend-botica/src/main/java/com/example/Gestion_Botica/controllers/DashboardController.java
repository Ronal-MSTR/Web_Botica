package com.example.Gestion_Botica.controllers;

import com.example.Gestion_Botica.dto.DashboardDTO;
import com.example.Gestion_Botica.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/resumen")
    // Solo permitimos que el Administrador vea estos datos sensibles
    public ResponseEntity<DashboardDTO> getResumen() {
        return ResponseEntity.ok(dashboardService.obtenerResumen());
    }
}
