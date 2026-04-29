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
    private final SessionService sessionService;

    public TrainerController(TrainerService trainerService, SessionService sessionService){
        this.trainerService = trainerService;
        this.sessionService = sessionService;
    }

    @PostMapping("/create")
    public ResponseEntity<Trainer> createTrainer(@Valid @RequestBody Trainer trainer) {
        Trainer res = trainerService.createTrainer(trainer);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/assignTrainer")
    public ResponseEntity<?> clientToTrainer(@Valid @RequestBody long client_id, long trainer_id){
        trainerService.assignClientToTrainer(client_id, trainer_id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sessions/{trainerId}")
    // Use PathVariable for url path params
    public ResponseEntity<List<TrainerSessionsResponse>> getSessionsByTrainerID(@PathVariable Long trainerId){
        return ResponseEntity.ok(sessionService.getSessions(trainerId));
    }

}
