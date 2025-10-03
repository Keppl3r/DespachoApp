package com.example.demo.persistencia;

import com.example.demo.dominio.Expediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpedienteRepository extends JpaRepository<Expediente, Integer> {

    @Query("SELECT e FROM Expediente e WHERE e.cliente.id = :clienteId")
    List<Expediente> findByClienteId(@Param("clienteId") int clienteId);

    /**
     * Busca expedientes para un cliente específico cuyo número de expediente contenga el texto proporcionado.
     * La búsqueda ignora mayúsculas y minúsculas.
     *
     * @param clienteId El ID del cliente al que pertenecen los expedientes.
     * @param numero El texto a buscar dentro del número de expediente.
     * @return Una lista de expedientes que coinciden con los criterios.
     */
    @Query("SELECT e FROM Expediente e WHERE e.cliente.id = :clienteId AND LOWER(e.numeroExpediente) LIKE LOWER(CONCAT('%', :numero, '%'))")
    List<Expediente> findByClienteIdAndNumeroExpedienteContainingIgnoreCase(@Param("clienteId") int clienteId, @Param("numero") String numero);

}
