package com.example.demo.servicio;

import com.example.demo.dominio.EventoAgenda;
import com.example.demo.persistencia.EventoAgendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventoAgendaService {

    @Autowired
    private EventoAgendaRepository eventoAgendaRepository;

    public EventoAgenda guardarEvento(EventoAgenda evento) {
        return eventoAgendaRepository.save(evento);
    }

    public List<EventoAgenda> obtenerTodosLosEventos() {
        return eventoAgendaRepository.findAll();
    }

    public Optional<EventoAgenda> obtenerEventoPorId(int id) {
        return eventoAgendaRepository.findById(id);
    }

    public void eliminarEvento(int id) {
        eventoAgendaRepository.deleteById(id);
    }

    public List<EventoAgenda> obtenerEventosPorExpedienteId(int expedienteId, LocalDate fechaInicio, LocalDate fechaFin) {
        if (fechaInicio != null && fechaFin != null) {
            return eventoAgendaRepository.findByExpedienteIdAndFechaBetween(expedienteId, fechaInicio, fechaFin);
        } else if (fechaInicio != null) {
            return eventoAgendaRepository.findByExpedienteIdAndFechaAfter(expedienteId, fechaInicio);
        } else if (fechaFin != null) {
            return eventoAgendaRepository.findByExpedienteIdAndFechaBefore(expedienteId, fechaFin);
        } else {
            return eventoAgendaRepository.findByExpedienteId(expedienteId);
        }
    }

    /**
     * NUEVO MÉTODO PARA EL DASHBOARD
     * Obtiene los eventos programados desde hoy hasta un número de días en el futuro.
     *
     * @param dias El número de días hacia el futuro a consultar.
     * @return Una lista de eventos próximos.
     */
    public List<EventoAgenda> obtenerEventosProximos(int dias) {
        LocalDate fechaInicio = LocalDate.now();
        LocalDate fechaFin = fechaInicio.plusDays(dias);
        return eventoAgendaRepository.findEventosProximos(fechaInicio, fechaFin);
    }
}
