package com.overload.server.controller;

import com.overload.server.DTOs.clients.requests.AssignClientToTrainerRequest;
import com.overload.server.DTOs.trainers.requests.CreateTrainerRequest;
import com.overload.server.DTOs.trainers.requests.LoginTrainerRequest;
import com.overload.server.DTOs.trainers.responses.CreateTrainerResponse;
import com.overload.server.DTOs.sessions.responses.TrainerSessionsResponse;
import com.overload.server.DTOs.trainers.responses.LoginTrainerResponse;
import com.overload.server.service.SessionService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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
        return ResponseEntity.status(HttpStatus.CREATED).body(trainerService.createTrainer(trainer));

    }

    @PostMapping("/assignClientToTrainer")
    public ResponseEntity<?> clientToTrainer(@Valid @RequestBody AssignClientToTrainerRequest req){
        trainerService.assignClientToTrainer(req);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/sessions/{trainerId}")
    // Use PathVariable for url path params
    public ResponseEntity<List<TrainerSessionsResponse>> getSessionsByTrainerID(@PathVariable Long trainerId){
        return ResponseEntity.ok(sessionService.getSessions(trainerId));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginTrainerResponse> loginTrainer(@Valid @RequestBody LoginTrainerRequest req){
        return ResponseEntity.ok(trainerService.loginTrainer(req));
    }

}
