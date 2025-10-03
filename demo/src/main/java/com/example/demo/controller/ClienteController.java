package com.example.demo.controller;

import com.example.demo.dominio.Cliente;
import com.example.demo.servicio.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    /**
     * Endpoint para OBTENER todos los clientes, con capacidad de búsqueda por nombre.
     * GET http://localhost:8080/api/clientes
     * GET http://localhost:8080/api/clientes?nombre=perez
     */
    @GetMapping
    public List<Cliente> obtenerTodosLosClientes(@RequestParam(required = false) String nombre) {
        return clienteService.obtenerTodosLosClientes(nombre);
    }

    @PostMapping
    public Cliente crearCliente(@Valid @RequestBody Cliente cliente) {
        return clienteService.guardarCliente(cliente);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerClientePorId(@PathVariable int id) {
        return clienteService.obtenerClientePorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizarCliente(@PathVariable int id, @Valid @RequestBody Cliente clienteActualizado) {
        return clienteService.obtenerClientePorId(id)
                .map(clienteExistente -> {
                    clienteActualizado.setId(id);
                    Cliente clienteGuardado = clienteService.guardarCliente(clienteActualizado);
                    return ResponseEntity.ok(clienteGuardado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable int id) {
        return clienteService.obtenerClientePorId(id)
                .map(cliente -> {
                    clienteService.eliminarCliente(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
