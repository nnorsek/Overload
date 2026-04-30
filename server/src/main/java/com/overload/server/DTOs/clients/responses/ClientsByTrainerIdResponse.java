package com.overload.server.DTOs.clients.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ClientsByTrainerIdResponse {

    private Long clientId;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private String gender;
    private Float startingWeight;
    private Float currentWeight;
    private Integer height;
    private String goal;
    private String photoUrl;
    private LocalDateTime startedAt;
}
