package com.overload.server.DTOs.clients.responses;

import java.time.LocalDateTime;

public record ClientResponse(
    Long id,
    String email,
    String firstName,
    String lastName,
    Integer height,
    Float currentWeight,
    LocalDateTime startedAt
) {}
