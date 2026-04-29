package com.overload.server.controller;

import com.overload.server.DTOs.sessions.responses.TrainerSessionsResponse;
import com.overload.server.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("session")
@CrossOrigin
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }


}
