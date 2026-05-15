package com.overload.server.DTOs.clients.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class CreateClientRequest {


    @NotBlank
    private String firstName;

    private String middleName;

    @NotBlank
    private String lastName;

    @NotNull
    private LocalDate dateOfBirth;

    @NotBlank
    private String gender;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8, max = 72)
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).+$",
             message = "Password must contain at least one uppercase letter, one number, and one special character")
    @NotBlank
    private String password;

    @Positive
    @NotNull
    private Float startingWeight;

    @NotNull
    @Positive
    private Integer height;

    private String goal;

    private String trainerId;
}
