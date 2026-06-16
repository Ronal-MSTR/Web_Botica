package com.example.Gestion_Botica.dto;

import lombok.Data;

@Data
public class DevolucionProvRequest {
    private Integer compraId;
    private Integer detalleCompraId;
    private Integer proveedorId;
    private Integer usuarioId;
    private Integer cantidad;
    private String motivo;
    private String nroGuiaSalida;
}