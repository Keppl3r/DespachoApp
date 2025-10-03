package com.example.demo.controller;

import com.example.demo.dominio.Expediente;
import com.example.demo.servicio.ExpedienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/expedientes")
public class ExpedienteController {

    @Autowired
    private ExpedienteService expedienteService;

    @GetMapping
    public List<Expediente> obtenerTodosLosExpedientes() {
        // Este método ahora podría considerarse obsoleto o para un rol de admin.
        // La búsqueda principal se hace por cliente.
        return expedienteService.obtenerTodosLosExpedientes();
    }

    /**
     * Endpoint para OBTENER los expedientes de un cliente, con capacidad de búsqueda por número.
     * GET http://localhost:8080/api/expedientes/por-cliente/{clienteId}
     * GET http://localhost:8080/api/expedientes/por-cliente/{clienteId}?numero=123
     */
    @GetMapping("/por-cliente/{clienteId}")
    public List<Expediente> obtenerExpedientesPorCliente(@PathVariable int clienteId, @RequestParam(required = false) String numero) {
        return expedienteService.obtenerExpedientesPorClienteId(clienteId, numero);
    }

    @PostMapping
    public Expediente crearExpediente(@Valid @RequestBody Expediente expediente) {
        return expedienteService.guardarExpediente(expediente);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expediente> obtenerExpedientePorId(@PathVariable int id) {
        return expedienteService.obtenerExpedientePorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expediente> actualizarExpediente(@PathVariable int id, @Valid @RequestBody Expediente expedienteActualizado) {
        return expedienteService.obtenerExpedientePorId(id)
                .map(expedienteExistente -> {
                    expedienteActualizado.setId(id);
                    Expediente expedienteGuardado = expedienteService.guardarExpediente(expedienteActualizado);
                    return ResponseEntity.ok(expedienteGuardado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarExpediente(@PathVariable int id) {
        return expedienteService.obtenerExpedientePorId(id)
                .map(expediente -> {
                    expedienteService.eliminarExpediente(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
