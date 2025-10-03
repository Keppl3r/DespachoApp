package com.example.demo.dominio;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "expedientes")
public class Expediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "El número de expediente es obligatorio")
    @Size(max = 50, message = "El número de expediente no puede tener más de 50 caracteres")
    private String numeroExpediente;

    @Size(max = 100, message = "El juzgado no puede tener más de 100 caracteres")
    private String juzgado;

    @Size(max = 100, message = "La materia no puede tener más de 100 caracteres")
    private String materia;

    @NotNull(message = "El expediente debe estar asociado a un cliente")
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    public Expediente() {
    }

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNumeroExpediente() { return numeroExpediente; }
    public void setNumeroExpediente(String numeroExpediente) { this.numeroExpediente = numeroExpediente; }
    public String getJuzgado() { return juzgado; }
    public void setJuzgado(String juzgado) { this.juzgado = juzgado; }
    public String getMateria() { return materia; }
    public void setMateria(String materia) { this.materia = materia; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}
