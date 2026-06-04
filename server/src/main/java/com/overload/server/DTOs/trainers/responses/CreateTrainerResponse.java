package com.overload.server.DTOs.trainers.responses;

public record CreateTrainerResponse(
    Long trainerId,
    String firstName,
    String lastName,
    String email,
    String gender,
    String token
) {}
