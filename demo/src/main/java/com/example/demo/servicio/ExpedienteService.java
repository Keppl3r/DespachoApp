package com.example.demo.servicio;

import com.example.demo.dominio.Expediente;
import com.example.demo.persistencia.ExpedienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ExpedienteService {

    @Autowired
    private ExpedienteRepository expedienteRepository;

    public Expediente guardarExpediente(Expediente expediente) {
        return expedienteRepository.save(expediente);
    }

    public List<Expediente> obtenerTodosLosExpedientes() {
        return expedienteRepository.findAll();
    }

    public Optional<Expediente> obtenerExpedientePorId(int id) {
        return expedienteRepository.findById(id);
    }

    public void eliminarExpediente(int id) {
        expedienteRepository.deleteById(id);
    }

    /**
     * Obtiene una lista de expedientes para un cliente. Si se proporciona un término de búsqueda (numero),
     * filtra la lista por el número de expediente. Si no, devuelve todos los expedientes del cliente.
     *
     * @param clienteId El ID del cliente.
     * @param numero El término de búsqueda para el número de expediente (puede ser nulo o vacío).
     * @return Una lista de expedientes para ese cliente, filtrada si es necesario.
     */
    public List<Expediente> obtenerExpedientesPorClienteId(int clienteId, String numero) {
        if (numero == null || numero.trim().isEmpty()) {
            return expedienteRepository.findByClienteId(clienteId);
        } else {
            return expedienteRepository.findByClienteIdAndNumeroExpedienteContainingIgnoreCase(clienteId, numero);
        }
    }
}
