package com.overload.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.overload.server.DTOs.clients.requests.ClientLoginRequest;
import com.overload.server.DTOs.clients.requests.CreateClientRequest;
import com.overload.server.DTOs.clients.responses.ClientByIdResponse;
import com.overload.server.DTOs.clients.responses.ClientLoginResponse;
import com.overload.server.DTOs.clients.responses.ClientsByTrainerIdResponse;
import com.overload.server.DTOs.clients.responses.CreateClientResponse;
import com.overload.server.security.UserDetailsImpl;
import com.overload.server.service.ClientService;

import jakarta.validation.Valid;



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
    public ResponseEntity<List<ClientsByTrainerIdResponse>> getMyClients(@AuthenticationPrincipal UserDetailsImpl trainer) {
        return ResponseEntity.ok(clientService.getAllClientByTrainerId(trainer.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientByIdResponse> getClientByID(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @PostMapping("/login")
    public ResponseEntity<ClientLoginResponse> loginClient(@Valid @RequestBody ClientLoginRequest req){
        return ResponseEntity.ok(clientService.loginClient(req));
    }

    






    
    

    
}
