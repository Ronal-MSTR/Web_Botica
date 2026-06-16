package com.example.Gestion_Botica.services;

import com.example.Gestion_Botica.dto.DevolucionProvRequest;
import com.example.Gestion_Botica.entities.*;
import com.example.Gestion_Botica.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DevolucionProveedorService {

        @Autowired
        private DevolucionProveedorRepository devProvRepository;
        @Autowired
        private CompraRepository compraRepository;
        @Autowired
        private LoteRepository loteRepository;
        @Autowired
        private ProveedorRepository proveedorRepository;
        @Autowired
        private UsuarioRepository usuarioRepository;

        @Transactional
        public DevolucionProveedor procesarDevolucionProveedor(DevolucionProvRequest request) {

                Compra compra = compraRepository.findById(request.getCompraId())
                                .orElseThrow(() -> new RuntimeException("La compra original no existe"));
                // ¡LA MAGIA AQUÍ! Buscamos el lote rastreando el detalle de la compra
                Lote lote = loteRepository.findAll().stream()
                                // Nota: Asumo que en tu entidad Lote tienes getDetalleCompra(). Si lo
                                // escribiste con guion bajo, cámbialo a getDetalle_compra()
                                .filter(l -> l.getDetalleCompra() != null &&
                                                l.getDetalleCompra().getDetalle_compra_id()
                                                                .equals(request.getDetalleCompraId()))
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException(
                                                "El lote correspondiente a esta compra no existe en el sistema"));
                Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                                .orElseThrow(() -> new RuntimeException("El proveedor no existe"));
                Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                                .orElseThrow(() -> new RuntimeException("Usuario administrador no encontrado"));

                // Regla de Negocio: No puedes devolver más de lo que tienes físicamente
                if (lote.getCantidadActual() < request.getCantidad()) {
                        throw new RuntimeException("Stock insuficiente. No puedes devolver " + request.getCantidad() +
                                        " unidades porque solo hay " + lote.getCantidadActual() + " en físico.");
                }

                // 1. DESCONTAR STOCK FÍSICO DEL ESTANTE (La mercadería se va de la botica)
                lote.setCantidadActual(lote.getCantidadActual() - request.getCantidad());
                loteRepository.save(lote);

                // 2. REGISTRAR LA AUDITORÍA DE SALIDA
                DevolucionProveedor devolucion = new DevolucionProveedor();
                devolucion.setCompra(compra);
                devolucion.setLote(lote);
                devolucion.setProveedor(proveedor);
                devolucion.setUsuario(usuario);
                devolucion.setCantidad(request.getCantidad());
                devolucion.setMotivo(request.getMotivo());
                devolucion.setNroGuiaSalida(request.getNroGuiaSalida());

                return devProvRepository.save(devolucion);
        }
}
