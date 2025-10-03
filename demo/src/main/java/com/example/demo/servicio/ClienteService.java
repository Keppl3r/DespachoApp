package com.example.demo.servicio;

import com.example.demo.dominio.Cliente;
import com.example.demo.persistencia.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public Cliente guardarCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    /**
     * Obtiene una lista de clientes. Si se proporciona un término de búsqueda (nombre),
     * filtra la lista. Si no, devuelve todos los clientes.
     *
     * @param nombre El término de búsqueda para el nombre del cliente (puede ser nulo o vacío).
     * @return Una lista de objetos Cliente.
     */
    public List<Cliente> obtenerTodosLosClientes(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            return clienteRepository.findAll();
        } else {
            return clienteRepository.findByNombreCompletoContainingIgnoreCase(nombre);
        }
    }

    public Optional<Cliente> obtenerClientePorId(int id) {
        return clienteRepository.findById(id);
    }

    public void eliminarCliente(int id) {
        clienteRepository.deleteById(id);
    }
}
