package com.example.demo.security;

import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${despacho.app.jwtSecret}")
    private String jwtSecret;

    @Value("${despacho.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @PostConstruct
    public void init() {
        logger.info("JwtUtils: Componente construido.");
        if (jwtSecret == null || jwtSecret.trim().isEmpty()) {
            logger.error("JwtUtils: ¡ERROR CRÍTICO! La propiedad 'despacho.app.jwtSecret' no se ha cargado. Es nula o vacía.");
        } else {
            logger.info("JwtUtils: La clave secreta se ha cargado correctamente. Longitud: {}", jwtSecret.length());
        }
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                // --- ESTA ES LA CORRECCIÓN ---
                .signWith(SignatureAlgorithm.HS256, jwtSecret) // Cambiado de HS512 a HS256
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Firma JWT inválida: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Token JWT mal formado: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("El token JWT ha expirado: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("El token JWT no es soportado: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Las claims del JWT están vacías: {}", e.getMessage());
        }

        return false;
    }
}
