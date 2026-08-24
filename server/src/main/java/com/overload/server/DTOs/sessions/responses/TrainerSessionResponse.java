package com.overload.server.DTOs.sessions.responses;

import com.overload.server.enums.SessionStatus;

import java.time.LocalDateTime;
import java.util.List;

public record TrainerSessionResponse(
    Long sessionId,
    List<ClientSummary> clients,
    LocalDateTime scheduledStart,
    LocalDateTime scheduledEnd,
    SessionStatus status,
    String notes
) {}
