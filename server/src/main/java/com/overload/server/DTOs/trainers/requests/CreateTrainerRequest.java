package com.overload.server.DTOs.trainers.requests;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreateTrainerRequest(
    @NotBlank String firstName,
    @NotBlank String lastName,
    @NotNull LocalDate dateOfBirth,
    @NotBlank String gender,
    String photoUrl,
    @Email @NotBlank String email,
    @Size(min = 8, max = 72)
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).+$",
             message = "Password must contain at least one uppercase letter, one number, and one special character")
    @NotBlank String password
) {}
