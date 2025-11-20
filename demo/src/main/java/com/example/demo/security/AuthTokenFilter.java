package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // --- INICIO DE LA DEPURACIÓN ---
        logger.info("====================================================================");
        logger.info("AuthTokenFilter: Interceptada petición a la ruta: [{} {}]", request.getMethod(), request.getRequestURI());

        try {
            String jwt = parseJwt(request);
            
            if (jwt == null) {
                logger.info("AuthTokenFilter: No se encontró token JWT en la cabecera 'Authorization'. Se cederá el control.");
            } else {
                logger.info("AuthTokenFilter: Se encontró un token JWT. Procediendo a validar...");
                if (jwtUtils.validateJwtToken(jwt)) {
                    logger.info("AuthTokenFilter: El token es VÁLIDO.");
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("AuthTokenFilter: Usuario '{}' autenticado y establecido en el contexto de seguridad.", username);
                } else {
                    logger.warn("AuthTokenFilter: La validación del token JWT ha fallado.");
                }
            }
        } catch (Exception e) {
            // Este bloque es crucial. Si jwtUtils o userDetailsService son nulos, aquí caerá la excepción.
            logger.error("AuthTokenFilter: ¡EXCEPCIÓN INESPERADA DENTRO DEL FILTRO! Causa: {}", e.getClass().getName(), e);
        }

        logger.info("AuthTokenFilter: Cediendo el control al siguiente filtro de la cadena.");
        logger.info("====================================================================");
        // --- FIN DE LA DEPURACIÓN ---
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
