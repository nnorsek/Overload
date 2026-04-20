package com.overload.server.service;

import java.util.List;
import java.util.Optional;

import com.overload.server.DTOs.ClientDTO;
import org.springframework.stereotype.Service;

import com.overload.server.model.Client;
import com.overload.server.repo.ClientRepo;

@Service
public class ClientService {
    
    private final ClientRepo clientRepo;

    public ClientService(ClientRepo clientRepo) {
        this.clientRepo = clientRepo;
        
    }

    public Client createClient(Client client) {
        return clientRepo.save(client);
    }



    public List<ClientDTO> getAllClients(){
        return clientRepo.findAll()
                .stream().map(c -> new ClientDTO(
                        c.getClient_id(),
                        c.getEmail(),
                        c.getFirst_name(),
                        c.getLast_name(),
                        c.getHeight(),
                        c.getCurrent_weight(),
                        c.getStarted_at()
                )).toList();
    }

    public Client getClient(Long id){
        return clientRepo.findById(id).orElseThrow(() -> new RuntimeException("Client not found with id" + id));
    }

}
