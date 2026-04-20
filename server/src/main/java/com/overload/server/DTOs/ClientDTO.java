package com.overload.server.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public class ClientDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Double height;
    private Double currentWeight;
    private LocalDateTime started_at;
    private TrainerDTO trainer;

    public ClientDTO(Long clientId, @NotBlank String email, @NotBlank String firstName, @NotBlank String lastName, @NotNull @Positive Integer height, @NotNull @Positive Float currentWeight, LocalDateTime startedAt) {
    }
}
