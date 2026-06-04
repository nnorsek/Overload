package com.overload.server.DTOs.clients.requests;

import jakarta.validation.constraints.NotNull;

public record AssignClientToTrainerRequest(
    @NotNull Long clientId,
    @NotNull Long trainerId
) {}
