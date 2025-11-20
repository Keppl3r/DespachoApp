package com.example.demo.security;

import com.example.demo.dominio.Usuario;
import com.example.demo.persistencia.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Autowired
    UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("--- UserDetailsService: Buscando al usuario '{}' en la base de datos... ---", username);
        
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("--- UserDetailsService: ¡Usuario '{}' no encontrado! ---", username);
                    return new UsernameNotFoundException("No se encontró el usuario con el nombre: " + username);
                });

        logger.info("--- UserDetailsService: ¡Usuario '{}' encontrado! Construyendo UserDetails... ---", username);
        return UserDetailsImpl.build(usuario);
    }
}
