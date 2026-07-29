package com.overload.server.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.overload.server.DTOs.sessions.requests.CreateSessionRequest;
import com.overload.server.security.UserDetailsImpl;
import com.overload.server.service.SessionService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/sessions")
@CrossOrigin
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<Void> createSession(@Valid @RequestBody CreateSessionRequest req, 
        @AuthenticationPrincipal UserDetailsImpl trainer) {
        sessionService.createSession(req, trainer.getId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSession(@PathVariable Long id, @Valid @RequestBody CreateSessionRequest req, 
        @AuthenticationPrincipal UserDetailsImpl trainer
    ) {
        sessionService.updateSession(id, req, trainer.getId());
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
