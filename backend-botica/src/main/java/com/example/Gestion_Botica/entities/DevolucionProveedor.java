package com.example.Gestion_Botica.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "devoluciones_proveedor")
@Data
public class DevolucionProveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dev_prov_id;

    // Asumiendo que ya tienes la entidad Compra creada según tu BD
    @ManyToOne
    @JoinColumn(name = "compra_id", nullable = false)
    private Compra compra;

    @ManyToOne
    @JoinColumn(name = "lote_id", nullable = false)
    private Lote lote;

    // Asumiendo que ya tienes la entidad Proveedor creada
    @ManyToOne
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario; // El administrador que autoriza la salida

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private String motivo; // Ej: "Lote próximo a vencer", "Cajas abolladas"

    @Column(nullable = false)
    private String estado = "ENVIADO_AL_PROVEEDOR";

    @Column(name = "nro_guia_salida")
    private String nroGuiaSalida;

    @Column(name = "fecha_devolucion")
    private LocalDateTime fechaDevolucion = LocalDateTime.now();
}
