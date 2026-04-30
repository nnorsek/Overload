package com.overload.server.service;

import com.overload.server.DTOs.clients.requests.AssignClientRequest;
import com.overload.server.DTOs.trainers.requests.CreateTrainerRequest;
import com.overload.server.DTOs.trainers.responses.CreateTrainerResponse;
import com.overload.server.model.Client;
import com.overload.server.repo.ClientRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.overload.server.model.Trainer;
import com.overload.server.repo.TrainerRepo;

@Service
public class TrainerService {

    private final TrainerRepo trainerRepo;
    private final ClientRepo clientRepo;

    private final PasswordEncoder passwordEncoder;

    public TrainerService(TrainerRepo trainerRepo, ClientRepo clientRepo, PasswordEncoder passwordEncoder){
        this.trainerRepo = trainerRepo;
        this.clientRepo = clientRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public CreateTrainerResponse createTrainer(CreateTrainerRequest req){

        Trainer trainer = new Trainer();

        trainer.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        trainer.setFirstName(req.getFirstName());
        trainer.setLastName(req.getLastName());
        trainer.setEmail(req.getEmail());
        trainer.setGender(req.getGender());
        trainer.setDateOfBirth(req.getDateOfBirth());
        trainer.setPhotoUrl(req.getPhotoUrl());

        Trainer saved = trainerRepo.save(trainer);
        return new CreateTrainerResponse(saved);
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


    }
