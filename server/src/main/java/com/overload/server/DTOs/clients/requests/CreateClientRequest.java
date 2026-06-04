package com.overload.server.DTOs.clients.requests;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreateClientRequest(
    @NotBlank String firstName,
    String middleName,
    @NotBlank String lastName,
    @NotNull LocalDate dateOfBirth,
    @NotBlank String gender,
    @Email @NotBlank String email,
    @Size(min = 8, max = 72)
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).+$",
             message = "Password must contain at least one uppercase letter, one number, and one special character")
    @NotBlank String password,
    @Positive @NotNull Float startingWeight,
    @NotNull @Positive Integer height,
    String goal,
    String trainerId
) {}
