package com.overload.server.DTOs.clients.responses;

import java.time.LocalDate;

public class ClientByIdResponse {
    private long clientId;
    private String firstName;
    private String lastName;
    private String goal;
    private Float startingWeight;
    private Float currentWeight;
    private Integer height;
    private String email;
    private String photoUrl;
    private LocalDate dateOfBirth;

    public ClientByIdResponse(Long clientId, String firstName, String lastName, String goal, Float startingWeight, Float currentWeight, Integer height, String email, String photoUrl, LocalDate dateOfBirth) {
        this.clientId = clientId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.goal = goal;
        this.startingWeight = startingWeight;
        this.currentWeight = currentWeight;
        this.height = height;
        this.email = email;
        this.photoUrl = photoUrl;
        this.dateOfBirth = dateOfBirth;
    }
}
