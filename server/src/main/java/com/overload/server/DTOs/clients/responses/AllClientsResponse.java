package com.overload.server.DTOs.clients.responses;

import com.overload.server.DTOs.trainers.TrainerDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AllClientsResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Double height;
    private Double currentWeight;
    private LocalDateTime startedAt;
    private TrainerDTO trainer;

    public AllClientsResponse(Long clientId, @NotBlank String email, @NotBlank String firstName, @NotBlank String lastName, @NotNull @Positive Integer height, @NotNull @Positive Float currentWeight, LocalDateTime startedAt) {
    }
}
