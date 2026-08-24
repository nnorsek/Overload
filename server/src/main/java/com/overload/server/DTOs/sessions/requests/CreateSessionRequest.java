package com.overload.server.DTOs.sessions.requests;

import java.time.LocalDateTime;
import java.util.List;

import com.overload.server.validations.ValidScheduleSession;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@ValidScheduleSession
public record CreateSessionRequest(
    @NotNull @Size(min = 1, message = "At least one client is required") List<Long> clientIds,
    @NotNull Long workoutId,
    @NotNull LocalDateTime scheduledStart,
    @NotNull @Future LocalDateTime scheduledEnd,
    @Size(max = 500) String notes
) {}
