package com.overload.server.DTOs.TrainerDTOs;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTrainerRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotNull
    private LocalDateTime dateOfBirth;

    @NotBlank
    private String gender;

    private String photoUrl;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8, max = 72)
    @NotBlank
    private String password;
}