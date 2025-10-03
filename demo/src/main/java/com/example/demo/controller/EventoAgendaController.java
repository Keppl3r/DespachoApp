package com.example.demo.controller;

import com.example.demo.dominio.EventoAgenda;
import com.example.demo.dominio.TipoEvento;
import com.example.demo.servicio.EventoAgendaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/eventos")
public class EventoAgendaController {

    @Autowired
    private EventoAgendaService eventoAgendaService;

    /**
     * NUEVO Endpoint para el DASHBOARD.
     * Obtiene los eventos para los próximos 'X' días.
     * GET http://localhost:8080/api/eventos/proximos?dias=7
     */
    @GetMapping("/proximos")
    public List<EventoAgenda> obtenerEventosProximos(@RequestParam(defaultValue = "7") int dias) {
        return eventoAgendaService.obtenerEventosProximos(dias);
    }

    @GetMapping
    public List<EventoAgenda> obtenerTodosLosEventos() {
        return eventoAgendaService.obtenerTodosLosEventos();
    }

    @GetMapping("/por-expediente/{expedienteId}")
    public List<EventoAgenda> obtenerEventosPorExpediente(
            @PathVariable int expedienteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return eventoAgendaService.obtenerEventosPorExpedienteId(expedienteId, fechaInicio, fechaFin);
    }

    @PostMapping
    public EventoAgenda crearEvento(@Valid @RequestBody EventoAgenda evento) {
        return eventoAgendaService.guardarEvento(evento);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoAgenda> obtenerEventoPorId(@PathVariable int id) {
        return eventoAgendaService.obtenerEventoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoAgenda> actualizarEvento(@PathVariable int id, @Valid @RequestBody EventoAgenda eventoActualizado) {
        return eventoAgendaService.obtenerEventoPorId(id)
                .map(eventoExistente -> {
                    eventoActualizado.setId(id);
                    EventoAgenda eventoGuardado = eventoAgendaService.guardarEvento(eventoActualizado);
                    return ResponseEntity.ok(eventoGuardado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable int id) {
        return eventoAgendaService.obtenerEventoPorId(id)
                .map(evento -> {
                    eventoAgendaService.eliminarEvento(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tipos")
    public List<String> obtenerTiposDeEvento() {
        return Arrays.stream(TipoEvento.values())
                     .map(Enum::name)
                     .collect(Collectors.toList());
    }
}
