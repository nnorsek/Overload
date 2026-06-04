package com.overload.server.DTOs.clients.responses;

import java.time.LocalDate;

public record ClientByIdResponse(
    Long clientId,
    String firstName,
    String lastName,
    String goal,
    Float startingWeight,
    Float currentWeight,
    Integer height,
    String email,
    String photoUrl,
    LocalDate dateOfBirth
) {}
