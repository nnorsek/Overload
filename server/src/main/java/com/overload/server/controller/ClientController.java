package com.overload.server.controller;

import java.util.List;

import com.overload.server.DTOs.ClientDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.overload.server.model.Client;
import com.overload.server.service.ClientService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/client")
@CrossOrigin
public class ClientController {

    private final ClientService clientService;

    
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createClient(@Valid @RequestBody Client client) {

        Client saved = clientService.createClient(client);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ClientDTO>> getAllClients() {

        List<ClientDTO> res = clientService.getAllClients();

        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientByID(@Valid @PathVariable Long id) {
        Client res = clientService.getClient(id);

        return ResponseEntity.ok(res);
    }






    
    

    
}
