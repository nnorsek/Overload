package com.overload.server.DTOs.clients.responses;

import lombok.AllArgsConstructor;
import java.time.LocalDate;

@AllArgsConstructor
public class ClientLoginResponse {
    private Long clientId;
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private String photoUrl;
    private String goal;
    private Float currentWeight;
    private Float startingWeight;
    private Integer height;
    private LocalDate dateOfBirth;
    private String token;
}
