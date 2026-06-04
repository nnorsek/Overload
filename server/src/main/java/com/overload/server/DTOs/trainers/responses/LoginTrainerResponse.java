package com.overload.server.DTOs.trainers.responses;

public record LoginTrainerResponse(
    Long id,
    String email,
    String token,
    String role
) {}
