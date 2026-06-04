package com.overload.server.service;

import java.util.List;

import com.overload.server.DTOs.clients.requests.ClientLoginRequest;
import com.overload.server.DTOs.clients.requests.CreateClientRequest;
import com.overload.server.DTOs.clients.responses.*;
import com.overload.server.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.overload.server.model.Client;
import com.overload.server.repo.ClientRepo;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepo clientRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public CreateClientResponse createClient(CreateClientRequest req) {

        if (clientRepo.findByEmail(req.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        Client client = Client.builder()
                .passwordHash(passwordEncoder.encode(req.password()))
                .firstName(req.firstName())
                .middleName(req.middleName())
                .lastName(req.lastName())
                .email(req.email())
                .gender(req.gender())
                .dateOfBirth(req.dateOfBirth())
                .goal(req.goal())
                .currentWeight(req.startingWeight())
                .startingWeight(req.startingWeight())
                .height(req.height())
                .build();

        Client saved = clientRepo.save(client);
        String token = jwtUtil.generateToken(req.email(), "ROLE_CLIENT", saved.getClientId());

        return new CreateClientResponse(
                saved.getClientId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail(),
                saved.getStartingWeight(),
                saved.getHeight(),
                saved.getGender(),
                token
        );
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

        Client found = clientRepo.findByEmail(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), found.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtUtil.generateToken(found.getEmail(), "ROLE_CLIENT", found.getClientId());

        return new ClientLoginResponse(
                found.getClientId(),
                found.getEmail(),
                token,
                "ROLE_CLIENT"
        );
    }
}
