package com.overload.server.controller;

import com.overload.server.DTOs.clients.requests.AssignClientRequest;
import com.overload.server.DTOs.trainers.requests.CreateTrainerRequest;
import com.overload.server.DTOs.trainers.responses.CreateTrainerResponse;
import com.overload.server.DTOs.sessions.responses.TrainerSessionsResponse;
import com.overload.server.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.overload.server.service.TrainerService;

import jakarta.validation.Valid;

import java.util.List;


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
    public ResponseEntity<CreateTrainerResponse> createTrainer(@Valid @RequestBody CreateTrainerRequest trainer) {
        return ResponseEntity.ok(trainerService.createTrainer(trainer));

    }

    @PostMapping("/assignTrainer")
    public ResponseEntity<?> clientToTrainer(@Valid @RequestBody AssignClientRequest req){
        trainerService.assignClientToTrainer(req);
        return ResponseEntity.ok().build(); // add response message here
    }

    @GetMapping("/sessions/{trainerId}")
    // Use PathVariable for url path params
    public ResponseEntity<List<TrainerSessionsResponse>> getSessionsByTrainerID(@PathVariable Long trainerId){
        return ResponseEntity.ok(sessionService.getSessions(trainerId));
    }

}
