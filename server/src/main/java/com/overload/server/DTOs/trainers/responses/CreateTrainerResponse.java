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
    private String photoUrl;
    private Instant createdAt;
    private String token;

    public CreateTrainerResponse(Trainer trainer) {
        this.trainerId = trainer.getTrainerId();
        this.firstName = trainer.getFirstName();
        this.lastName = trainer.getLastName();
        this.email = trainer.getEmail();
        this.gender = trainer.getGender();
        this.photoUrl = trainer.getPhotoUrl();
        this.createdAt = trainer.getCreatedAt();
    }
}
