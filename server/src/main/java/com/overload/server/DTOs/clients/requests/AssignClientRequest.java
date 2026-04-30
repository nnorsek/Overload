package com.overload.server.DTOs.clients.requests;

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
