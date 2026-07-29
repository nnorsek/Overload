package com.overload.server.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.overload.server.DTOs.clients.requests.AssignClientToTrainerRequest;
import com.overload.server.DTOs.sessions.responses.TrainerSessionResponse;
import com.overload.server.DTOs.trainers.requests.CreateTrainerRequest;
import com.overload.server.DTOs.trainers.requests.LoginTrainerRequest;
import com.overload.server.DTOs.trainers.responses.CreateTrainerResponse;
import com.overload.server.DTOs.trainers.responses.LoginTrainerResponse;
import com.overload.server.security.UserDetailsImpl;
import com.overload.server.service.SessionService;
import com.overload.server.service.TrainerService;

import jakarta.validation.Valid;


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

    @GetMapping("/sessions")
    public ResponseEntity<List<TrainerSessionResponse>> getSessionsByTrainerID(@AuthenticationPrincipal UserDetailsImpl trainer){
        return ResponseEntity.ok(sessionService.getSessions(trainer.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginTrainerResponse> loginTrainer(@Valid @RequestBody LoginTrainerRequest req){
        return ResponseEntity.ok(trainerService.loginTrainer(req));
    }

}
