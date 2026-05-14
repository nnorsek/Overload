package com.overload.server.controller;

import java.util.List;
import java.util.Map;

import com.overload.server.DTOs.clients.requests.ClientLoginRequest;
import com.overload.server.DTOs.clients.requests.CreateClientRequest;
import com.overload.server.DTOs.clients.responses.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.overload.server.service.ClientService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/client")
@CrossOrigin
public class ClientController {

    private final ClientService clientService;

    
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping("/create")
    public ResponseEntity<CreateClientResponse> createClient(@Valid @RequestBody CreateClientRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.createClient(req));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ClientResponse>> getAllClients() {

        List<ClientResponse> res = clientService.getAllClients();

        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientByIdResponse> getClientByID(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @GetMapping("/all/{trainerId}")
    public ResponseEntity<List<ClientsByTrainerIdResponse>> getClientsByTrainerId(@PathVariable("trainerId") long trainerId) {
        return ResponseEntity.ok(clientService.getAllClientByTrainerId(trainerId));
    }

    @GetMapping("/login")
    public ResponseEntity<ClientLoginResponse> loginClient(@RequestBody @Valid ClientLoginRequest req){
        return ResponseEntity.ok(clientService.loginClient(req));
    }








    
    

    
}
