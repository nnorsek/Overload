package com.overload.server.DTOs.clients.responses;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ClientsByTrainerIdResponse(
    Long clientId,
    String firstName,
    String lastName,
    String email,
    LocalDate dateOfBirth,
    String gender,
    Float startingWeight,
    Float currentWeight,
    Integer height,
    String goal,
    String photoUrl,
    LocalDateTime startedAt
) {}
