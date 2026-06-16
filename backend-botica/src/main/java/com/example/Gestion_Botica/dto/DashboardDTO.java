package com.example.Gestion_Botica.dto;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Map;

@Data
@AllArgsConstructor
public class DashboardDTO {
    // Datos para las 4 tarjetas superiores
    private Double ingresosHoy;
    private Long stockTotal;
    private Long ticketsHoy;
    private Long usuariosActivos;

    // Datos para el gráfico de barras (Ventas últimos 7 días)
    // Ejemplo: {"2023-10-01": 450.0, "2023-10-02": 320.0...}
    private Map<String, Double> ventasUltimaSemana;

    // NUEVO: Datos para el gráfico de pastel
    private Map<String, Double> ventasPorCategoria;

    // NUEVO: Datos para el gráfico de barras
    private List<TopProductoDTO> topProductos;
}
