package com.overload.server.DTOs.trainers.requests;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignClientToTrainerRequest {

    @NotNull
    private long clientId;

    @NotNull
    private long trainerId;
}
