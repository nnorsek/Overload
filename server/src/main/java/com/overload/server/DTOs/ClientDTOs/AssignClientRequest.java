package com.overload.server.DTOs.ClientDTOs;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignClientRequest {

    @NotNull
    @Positive
    private long clientId;

    @NotNull
    @Positive
    private long trainerId;
}
