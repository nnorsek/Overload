package com.overload.server.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.overload.server.DTOs.ClientDTO;
import com.overload.server.DTOs.TrainerDTO;
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
                        c.getClientId(),
                        c.getEmail(),
                        c.getFirstName(),
                        c.getLastName(),
                        c.getHeight(),
                        c.getCurrentWeight(),
                        c.getStartedAt()
                )).toList();
    }

    public Client getClient(Long id){
        return clientRepo.findById(id).orElseThrow(() -> new RuntimeException("Client not found with id" + id));
    }

}
