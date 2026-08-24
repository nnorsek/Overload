package com.overload.server.DTOs.sessions.requests;

import jakarta.validation.constraints.NotNull;

public record AddClientRequest(@NotNull Long clientId) {}
