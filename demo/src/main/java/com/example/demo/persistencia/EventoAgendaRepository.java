package com.example.demo.persistencia;

import com.example.demo.dominio.EventoAgenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventoAgendaRepository extends JpaRepository<EventoAgenda, Integer> {

    @Query("SELECT ev FROM EventoAgenda ev WHERE ev.expediente.id = :expedienteId ORDER BY ev.fecha DESC")
    List<EventoAgenda> findByExpedienteId(@Param("expedienteId") int expedienteId);

    @Query("SELECT ev FROM EventoAgenda ev WHERE ev.expediente.id = :expedienteId AND ev.fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY ev.fecha DESC")
    List<EventoAgenda> findByExpedienteIdAndFechaBetween(@Param("expedienteId") int expedienteId, @Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT ev FROM EventoAgenda ev WHERE ev.expediente.id = :expedienteId AND ev.fecha >= :fechaInicio ORDER BY ev.fecha DESC")
    List<EventoAgenda> findByExpedienteIdAndFechaAfter(@Param("expedienteId") int expedienteId, @Param("fechaInicio") LocalDate fechaInicio);

    @Query("SELECT ev FROM EventoAgenda ev WHERE ev.expediente.id = :expedienteId AND ev.fecha <= :fechaFin ORDER BY ev.fecha DESC")
    List<EventoAgenda> findByExpedienteIdAndFechaBefore(@Param("expedienteId") int expedienteId, @Param("fechaFin") LocalDate fechaFin);

    /**
     * MÉTODO CORREGIDO PARA EL DASHBOARD
     * Busca todos los eventos en un rango de fechas, trayendo explícitamente (JOIN FETCH)
     * la información del expediente y del cliente asociado para evitar problemas de Lazy Loading.
     */
    @Query("SELECT ev FROM EventoAgenda ev JOIN FETCH ev.expediente exp JOIN FETCH exp.cliente WHERE ev.fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY ev.fecha ASC")
    List<EventoAgenda> findEventosProximos(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

}
