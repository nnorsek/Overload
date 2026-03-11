package com.overload.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.overload.server.model.Trainer;
import com.overload.server.service.TrainerService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/trainer")
@CrossOrigin
public class TrainerController {
    
    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService){
        this.trainerService = trainerService;
    }

    @PostMapping("/create")
    public ResponseEntity<Trainer> createTrainer(@Valid @RequestBody Trainer trainer) {
        Trainer res = trainerService.createTrainer(trainer);

        return ResponseEntity.ok(res);
    }
    

}
