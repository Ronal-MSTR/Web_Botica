package com.example.Gestion_Botica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopProductoDTO {
    private String producto;
    private Integer cantidad;
}