package com.overload.server.service;

import java.util.List;
import java.util.Optional;

import com.overload.server.DTOs.clients.requests.ClientLoginRequest;
import com.overload.server.DTOs.clients.requests.CreateClientRequest;
import com.overload.server.DTOs.clients.responses.*;
import com.overload.server.DTOs.trainers.responses.CreateTrainerResponse;
import com.overload.server.model.Trainer;
import com.overload.server.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.overload.server.model.Client;
import com.overload.server.repo.ClientRepo;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ClientService {
    
    private final ClientRepo clientRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public ClientService(ClientRepo clientRepo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.clientRepo = clientRepo;
        this.passwordEncoder = passwordEncoder;

        this.jwtUtil = jwtUtil;
    }

    public CreateClientResponse createClient(CreateClientRequest req) {

        if (clientRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        Client client = Client.builder()
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .firstName(req.getFirstName())
                .middleName(req.getMiddleName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .gender(req.getGender())
                .dateOfBirth(req.getDateOfBirth())
                .goal(req.getGoal())
                .currentWeight(req.getStartingWeight())
                .startingWeight(req.getStartingWeight())
                .height(req.getHeight())
                .build();

        Client saved = clientRepo.save(client);
        String token = jwtUtil.generateToken(req.getEmail(), "CLIENT");

        return CreateClientResponse.builder()
                .token(token)
                .clientId(saved.getClientId())
                .firstName(saved.getFirstName())
                .lastName(saved.getLastName())
                .email(saved.getEmail())
                .startingWeight(saved.getStartingWeight())
                .height(saved.getHeight())
                .gender(saved.getGender())
                .photoUrl(saved.getPhotoUrl())
                .build();
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

    public ClientByIdResponse getClientById(Long id){
        Client c = clientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id " + id));
        return new ClientByIdResponse(
                c.getClientId(),
                c.getFirstName(),
                c.getLastName(),
                c.getGoal(),
                c.getStartingWeight(),
                c.getCurrentWeight(),
                c.getHeight(),
                c.getEmail(),
                c.getPhotoUrl(),
                c.getDateOfBirth()
        );
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

    public ClientLoginResponse loginClient(ClientLoginRequest req){

        Client found = clientRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Failed to find client by email: " + req.getEmail()));

        if (!passwordEncoder.matches(req.getPassword(), found.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Password is incorrect");
        }

        String token = jwtUtil.generateToken(found.getEmail(), "ROLE_CLIENT");

        return new ClientLoginResponse(
                found.getClientId(),
                found.getFirstName(),
                found.getLastName(),
                found.getEmail(),
                found.getGender(),
                found.getPhotoUrl(),
                found.getGoal(),
                found.getCurrentWeight(),
                found.getStartingWeight(),
                found.getHeight(),
                found.getDateOfBirth(),
                token
        );
    }


}
