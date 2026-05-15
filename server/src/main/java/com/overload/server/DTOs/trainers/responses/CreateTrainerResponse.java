package com.overload.server.DTOs.trainers.responses;

import com.overload.server.model.Trainer;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Builder
public class CreateTrainerResponse {

    private Long trainerId;
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private Instant createdAt;
    private String token;
}
