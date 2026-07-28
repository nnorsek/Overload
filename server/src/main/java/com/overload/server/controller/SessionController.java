package com.overload.server.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.overload.server.DTOs.sessions.requests.CreateSessionRequest;
import com.overload.server.service.SessionService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/sessions")
@CrossOrigin
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<Void> createSession(@Valid @RequestBody CreateSessionRequest req) {
        sessionService.createSession(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
