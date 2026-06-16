package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.dto.DashboardDTO;
import com.example.Gestion_Botica.dto.TopProductoDTO;
import com.example.Gestion_Botica.repositories.UsuarioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public DashboardDTO obtenerResumen() {
        // 1. Calcular ingresos de hoy
        Query qIngresos = entityManager.createNativeQuery(
            "SELECT COALESCE(SUM(total), 0) FROM ventas WHERE DATE(fecha_venta AT TIME ZONE 'America/Lima') = CURRENT_DATE");
        Double ingresosHoy = ((Number) qIngresos.getSingleResult()).doubleValue();

        // 2. Calcular stock total de productos (suma de todos los lotes)
        Query qStock = entityManager.createNativeQuery("SELECT SUM(cantidad_actual) FROM lotes");
        Long stockTotal = ((Number) qStock.getSingleResult()).longValue();

        // 3. Contar tickets de hoy
        Query qTickets = entityManager.createNativeQuery(
            "SELECT COUNT(*) FROM ventas WHERE DATE(fecha_venta) = CURRENT_DATE");
        Long ticketsHoy = ((Number) qTickets.getSingleResult()).longValue();

        // 4. Usuarios activos
        Long usuariosActivos = usuarioRepository.countByActivo(true);

        // 5. Ventas de los últimos 7 días
        Query qGrafico = entityManager.createNativeQuery(
            "SELECT TO_CHAR(fecha_venta AT TIME ZONE 'America/Lima', 'YYYY-MM-DD') as fecha, SUM(total) " +
            "FROM ventas " +
            "WHERE (fecha_venta AT TIME ZONE 'America/Lima') >= CURRENT_DATE - INTERVAL '7 days' " +
            "GROUP BY fecha ORDER BY fecha ASC");
        
        List<Object[]> resultadosGrafico = qGrafico.getResultList();
        Map<String, Double> ventasSemana = new LinkedHashMap<>();
        for (Object[] row : resultadosGrafico) {
            ventasSemana.put(row[0].toString(), ((Number) row[1]).doubleValue());
        }

        // 6. NUEVO: Ventas por Categoría (Gráfico Pastel)
        // Sumamos el subtotal de cada detalle y lo agrupamos por el nombre de la categoría
        String sqlCategorias = 
            "SELECT c.nombre, SUM(dv.subtotal) " +
            "FROM detalle_ventas dv " + // <-- Nombre corregido
            "JOIN lotes l ON dv.lote_id = l.lote_id " + // <-- JOIN intermedio con lotes
            "JOIN productos p ON l.producto_id = p.producto_id " + // <-- JOIN con productos
            "JOIN categorias c ON p.categoria_id = c.categoria_id " + // <-- IDs corregidos
            "GROUP BY c.nombre";
            
        Query qCategorias = entityManager.createNativeQuery(sqlCategorias);
        List<Object[]> resultadosCategorias = qCategorias.getResultList();
        Map<String, Double> ventasPorCategoria = new LinkedHashMap<>();
        for (Object[] row : resultadosCategorias) {
            // Validamos que no vengan nulos
            if (row[0] != null && row[1] != null) {
                ventasPorCategoria.put(row[0].toString(), ((Number) row[1]).doubleValue());
            }
        }

        // 7. NUEVO: Top 5 Productos Más Vendidos (Gráfico Barras)
        // Sumamos las cantidades vendidas agrupadas por el nombre del producto, orden descendente
        String sqlTop = 
            "SELECT p.nombre_comercial, SUM(dv.cantidad) as total_vendido " + // <-- Usando nombre_comercial
            "FROM detalle_ventas dv " + // <-- Nombre corregido
            "JOIN lotes l ON dv.lote_id = l.lote_id " + // <-- JOIN intermedio con lotes
            "JOIN productos p ON l.producto_id = p.producto_id " + // <-- JOIN con productos
            "GROUP BY p.nombre_comercial " +
            "ORDER BY total_vendido DESC " +
            "LIMIT 5";
            
        Query qTop = entityManager.createNativeQuery(sqlTop);
        List<Object[]> resultadosTop = qTop.getResultList();
        List<TopProductoDTO> topProductos = new ArrayList<>();
        for (Object[] row : resultadosTop) {
            if (row[0] != null && row[1] != null) {
                topProductos.add(new TopProductoDTO(row[0].toString(), ((Number) row[1]).intValue()));
            }
        }

        // Retornamos el DTO actualizado con las 7 métricas
        return new DashboardDTO(
            ingresosHoy, 
            stockTotal, 
            ticketsHoy, 
            usuariosActivos, 
            ventasSemana, 
            ventasPorCategoria, 
            topProductos
        );
    }
}