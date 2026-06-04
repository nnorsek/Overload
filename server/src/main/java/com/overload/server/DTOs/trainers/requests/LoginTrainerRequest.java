package com.overload.server.DTOs.trainers.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LoginTrainerRequest(
    @Email @NotNull String email,
    @Size(min = 7, max = 72) String password
) {}
