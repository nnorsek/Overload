package com.overload.server.service;

import com.overload.server.DTOs.clients.requests.AssignClientRequest;
import com.overload.server.DTOs.clients.responses.CreateClientResponse;
import com.overload.server.DTOs.trainers.requests.CreateTrainerRequest;
import com.overload.server.DTOs.trainers.requests.LoginTrainerRequest;
import com.overload.server.DTOs.trainers.responses.CreateTrainerResponse;
import com.overload.server.DTOs.trainers.responses.LoginTrainerResponse;
import com.overload.server.model.Client;
import com.overload.server.repo.ClientRepo;
import com.overload.server.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.overload.server.model.Trainer;
import com.overload.server.repo.TrainerRepo;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TrainerService {

    private final TrainerRepo trainerRepo;
    private final ClientRepo clientRepo;
    private final JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder;

    public TrainerService(TrainerRepo trainerRepo, ClientRepo clientRepo, JwtUtil jwtUtil, PasswordEncoder passwordEncoder){
        this.trainerRepo = trainerRepo;
        this.clientRepo = clientRepo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public CreateTrainerResponse createTrainer(CreateTrainerRequest req){

        if (trainerRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        Trainer trainer = Trainer.builder()
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .gender(req.getGender())
                .dateOfBirth(req.getDateOfBirth())
                .photoUrl(req.getPhotoUrl())
                .build();


        Trainer saved = trainerRepo.save(trainer);
        String token = jwtUtil.generateToken(req.getEmail(), "TRAINER");
        return CreateTrainerResponse.builder()
                .token(token)
                .trainerId(saved.getTrainerId())
                .firstName(saved.getFirstName())
                .lastName(saved.getLastName())
                .email(saved.getEmail())
                .gender(saved.getGender())
                .build();
    }

    public void assignClientToTrainer(AssignClientRequest req) {

        long trainerId = req.getTrainerId();
        long clientId = req.getClientId();

        Trainer trainer = trainerRepo.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found."));

        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found."));

        trainer.addClient(client);

        trainerRepo.save(trainer);
    }

    public LoginTrainerResponse loginTrainer(LoginTrainerRequest req){
        Trainer found = trainerRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), found.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtUtil.generateToken(req.getEmail(), "ROLE_TRAINER");

        return new LoginTrainerResponse(found.getTrainerId(), found.getFirstName(), found.getLastName(), found.getEmail(), found.getGender(),
                 found.getPhotoUrl(), token);
   }

    }
