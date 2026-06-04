package com.overload.server.DTOs.clients.responses;

public record ClientLoginResponse(
    Long id,
    String email,
    String token,
    String role
) {}
