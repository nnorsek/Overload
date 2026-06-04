package com.overload.server.DTOs.sessions.responses;

import com.overload.server.enums.SessionStatus;

import java.time.LocalDateTime;

public record TrainerSessionsResponse(
    long sessionId,
    String clientFirstName,
    String clientLastName,
    LocalDateTime scheduledStart,
    LocalDateTime scheduledEnd,
    SessionStatus status,
    String notes
) {}
