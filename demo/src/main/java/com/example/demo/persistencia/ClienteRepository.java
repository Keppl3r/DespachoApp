package com.example.demo.persistencia;

import com.example.demo.dominio.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    /**
     * Nuevo método para buscar clientes por una parte de su nombre completo, ignorando mayúsculas/minúsculas.
     * Spring Data JPA genera la consulta automáticamente a partir del nombre del método.
     *
     * @param nombre El texto a buscar dentro del nombre completo de los clientes.
     * @return Una lista de clientes que coinciden con el criterio de búsqueda.
     */
    List<Cliente> findByNombreCompletoContainingIgnoreCase(String nombre);

}
