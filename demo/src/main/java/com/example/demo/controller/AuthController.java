package com.example.demo.controller;

import com.example.demo.dominio.Usuario;
import com.example.demo.payload.JwtResponse;
import com.example.demo.payload.LoginRequest;
import com.example.demo.payload.MessageResponse;
import com.example.demo.payload.SignupRequest;
import com.example.demo.persistencia.UsuarioRepository;
import com.example.demo.security.JwtUtils;
import com.example.demo.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("==================== INICIO LOGIN ====================");
        logger.info("Recibida petición de login para el usuario: {}", loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            logger.info("¡Autenticación exitosa! Procediendo...");
            
            // --- INICIO DE LA DEPURACIÓN ---
            Object principal = authentication.getPrincipal();
            logger.info("Clase del objeto Principal: {}", principal.getClass().getName());
            // --- FIN DE LA DEPURACIÓN ---

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) principal; // El error está probablemente aquí

            logger.info("==================== FIN LOGIN (ÉXITO) ====================");
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail()));
        } catch (BadCredentialsException e) {
            logger.error("Login fallido: Credenciales inválidas para el usuario '{}'", loginRequest.getUsername());
            logger.info("==================== FIN LOGIN (ERROR) ====================");
            return ResponseEntity.status(401).body(new MessageResponse("Error: ¡Credenciales inválidas!"));
        } catch (Exception e) {
            logger.error("Login fallido: Ocurrió una excepción inesperada después de la autenticación.", e);
            logger.info("==================== FIN LOGIN (ERROR) ====================");
            return ResponseEntity.status(500).body(new MessageResponse("Error: Ocurrió un error en el servidor."));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // ... (el código de signup se mantiene igual)
        logger.info("==================== INICIO REGISTRO ====================");
        logger.info("Recibida petición de registro para el usuario: {}", signUpRequest.getUsername());
        logger.info("Email recibido: {}", signUpRequest.getEmail());

        boolean usernameExists = usuarioRepository.existsByUsername(signUpRequest.getUsername());
        logger.info("Comprobando si el usuario '{}' existe... Resultado: {}", signUpRequest.getUsername(), usernameExists);

        if (usernameExists) {
            logger.warn("Registro fallido: El nombre de usuario ya está en uso.");
            logger.info("==================== FIN REGISTRO (ERROR) ====================");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: ¡El nombre de usuario ya está en uso!"));
        }

        boolean emailExists = usuarioRepository.existsByEmail(signUpRequest.getEmail());
        logger.info("Comprobando si el email '{}' existe... Resultado: {}", signUpRequest.getEmail(), emailExists);

        if (emailExists) {
            logger.warn("Registro fallido: El email ya está en uso.");
            logger.info("==================== FIN REGISTRO (ERROR) ====================");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: ¡El email ya está en uso!"));
        }

        logger.info("Validaciones pasadas. Creando nuevo usuario...");
        Usuario usuario = new Usuario(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        usuarioRepository.save(usuario);
        logger.info("Usuario guardado en la base de datos con éxito.");
        logger.info("==================== FIN REGISTRO (ÉXITO) ====================");

        return ResponseEntity.ok(new MessageResponse("¡Usuario registrado con éxito!"));
    }
    @Autowired
    com.example.demo.security.GoogleAuthService googleAuthService;

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody java.util.Map<String, String> payload) {
        String token = payload.get("token");
        try {
            com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload googlePayload = googleAuthService.verifyToken(token);
            String email = googlePayload.getEmail();
            String name = (String) googlePayload.get("name");

            // Check if user exists
            Usuario user = usuarioRepository.findByUsername(email).orElse(null);
            if (user == null) {
                // Create new user
                user = new Usuario(email, email, encoder.encode("GOOGLE_AUTH_SECRET"));
                usuarioRepository.save(user);
            }

            // Authenticate
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, "GOOGLE_AUTH_SECRET"));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid Google Token"));
        }
    }
}
