package com.overload.server.DTOs.trainers.responses;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class LoginTrainerResponse {

    private Long trainerId;
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private String photoUrl;
    private String token;
}
