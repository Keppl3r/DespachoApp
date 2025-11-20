package com.example.demo.persistencia;

import com.example.demo.dominio.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su nombre de usuario.
     * Spring Security lo usará para cargar los detalles del usuario durante la autenticación.
     * @param username El nombre de usuario a buscar.
     * @return Un Optional que contiene al usuario si se encuentra.
     */
    Optional<Usuario> findByUsername(String username);

    /**
     * Comprueba si ya existe un usuario con el nombre de usuario proporcionado.
     * Esencial para el proceso de registro para evitar duplicados.
     * @param username El nombre de usuario a comprobar.
     * @return true si existe, false si no.
     */
    Boolean existsByUsername(String username);

    /**
     * Comprueba si ya existe un usuario con el email proporcionado.
     * Esencial para el proceso de registro para evitar duplicados.
     * @param email El email a comprobar.
     * @return true si existe, false si no.
     */
    Boolean existsByEmail(String email);
}
