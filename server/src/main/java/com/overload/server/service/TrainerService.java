package com.overload.server.service;

import org.springframework.stereotype.Service;

import com.overload.server.model.Trainer;
import com.overload.server.repo.TrainerRepo;

@Service
public class TrainerService {
    
    // what is this doing
    private final TrainerRepo trainerRepo;

    // what is this doing?
    public TrainerService(TrainerRepo trainerRepo){
        this.trainerRepo = trainerRepo;
    }

    public Trainer createTrainer(Trainer trainer){
        return trainerRepo.save(trainer);
    }


}
