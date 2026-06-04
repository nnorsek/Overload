package com.overload.server.service;

import com.overload.server.DTOs.clients.requests.AssignClientToTrainerRequest;
import com.overload.server.DTOs.trainers.requests.CreateTrainerRequest;
import com.overload.server.DTOs.trainers.requests.LoginTrainerRequest;
import com.overload.server.DTOs.trainers.responses.CreateTrainerResponse;
import com.overload.server.DTOs.trainers.responses.LoginTrainerResponse;
import com.overload.server.model.Client;
import com.overload.server.repo.ClientRepo;
import com.overload.server.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.overload.server.model.Trainer;
import com.overload.server.repo.TrainerRepo;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerRepo trainerRepo;
    private final ClientRepo clientRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;


    public CreateTrainerResponse createTrainer(CreateTrainerRequest req){

        if (trainerRepo.findByEmail(req.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        Trainer trainer = Trainer.builder()
                .passwordHash(passwordEncoder.encode(req.password()))
                .firstName(req.firstName())
                .lastName(req.lastName())
                .email(req.email())
                .gender(req.gender())
                .dateOfBirth(req.dateOfBirth())
                .photoUrl(req.photoUrl())
                .build();

        Trainer saved = trainerRepo.save(trainer);
        String token = jwtUtil.generateToken(req.email(), "ROLE_TRAINER", saved.getTrainerId());

        return new CreateTrainerResponse(
                saved.getTrainerId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail(),
                saved.getGender(),
                token
        );
    }

    public void assignClientToTrainer(AssignClientToTrainerRequest req) {

        long trainerId = req.trainerId();
        long clientId = req.clientId();

        Trainer trainer = trainerRepo.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found."));

        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found."));

        client.setStartedAt(LocalDateTime.now());
        trainer.addClient(client);

        trainerRepo.save(trainer);
    }

    public LoginTrainerResponse loginTrainer(LoginTrainerRequest req){
        Trainer found = trainerRepo.findByEmail(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), found.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtUtil.generateToken(req.email(), "ROLE_TRAINER", found.getTrainerId());

        return new LoginTrainerResponse(
                found.getTrainerId(),
                found.getEmail(),
                token,
                "ROLE_TRAINER");
   }
}
