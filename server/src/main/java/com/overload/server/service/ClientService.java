package com.overload.server.service;

import java.util.List;

import com.overload.server.DTOs.clients.responses.ClientResponse;
import com.overload.server.DTOs.clients.responses.ClientsByTrainerIdResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.overload.server.model.Client;
import com.overload.server.repo.ClientRepo;

@Service
public class ClientService {
    
    private final ClientRepo clientRepo;
    private final PasswordEncoder passwordEncoder;

    public ClientService(ClientRepo clientRepo, PasswordEncoder passwordEncoder) {
        this.clientRepo = clientRepo;
        this.passwordEncoder = passwordEncoder;
        
    }
    // Update to a DTO using passwordHash
    public Client createClient(Client client) {
        return clientRepo.save(client);
    }

    public List<ClientResponse> getAllClients(){
        return clientRepo.findAll()
                .stream().map(c -> new ClientResponse(
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

    public List<ClientsByTrainerIdResponse> getAllClientByTrainerId(long trainerId) {
        return clientRepo.findByTrainerTrainerId(trainerId)
                .stream()
                .map(client -> new ClientsByTrainerIdResponse(
                        client.getClientId(),
                        client.getFirstName(),
                        client.getLastName(),
                        client.getEmail(),
                        client.getDateOfBirth(),
                        client.getGender(),
                        client.getStartingWeight(),
                        client.getCurrentWeight(),
                        client.getHeight(),
                        client.getGoal(),
                        client.getPhotoUrl(),
                        client.getStartedAt()
                )).toList();
    }


}
