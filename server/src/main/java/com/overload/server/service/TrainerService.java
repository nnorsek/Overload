package com.overload.server.service;

import com.overload.server.model.Client;
import com.overload.server.repo.ClientRepo;
import org.springframework.stereotype.Service;

import com.overload.server.model.Trainer;
import com.overload.server.repo.TrainerRepo;

@Service
public class TrainerService {

    private final TrainerRepo trainerRepo;
    private final ClientRepo clientRepo;

    public TrainerService(TrainerRepo trainerRepo, ClientRepo clientRepo){
        this.trainerRepo = trainerRepo;
        this.clientRepo = clientRepo;
    }

    public Trainer createTrainer(Trainer trainer){
        return trainerRepo.save(trainer);
    }

    public void assignClientToTrainer(long client_id, long trainer_id) {
        Trainer trainer = trainerRepo.findById(trainer_id)
                .orElseThrow(() -> new RuntimeException("Trainer not found."));

        Client client = clientRepo.findById(client_id)
                .orElseThrow(() -> new RuntimeException("Client not found."));

        trainer.addClient(client);

        trainerRepo.save(trainer);
    }




}
