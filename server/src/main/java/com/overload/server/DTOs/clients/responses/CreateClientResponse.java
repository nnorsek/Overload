package com.overload.server.DTOs.clients.responses;

public record CreateClientResponse(
    Long clientId,
    String firstName,
    String lastName,
    String email,
    Float startingWeight,
    Integer height,
    String gender,
    String token
) {}
