package com.overload.server.DTOs.trainers.responses;

import com.overload.server.model.Trainer;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class CreateTrainerResponse {

    private Long trainerId;
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private String photoUrl;
    private Instant createdAt;

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
