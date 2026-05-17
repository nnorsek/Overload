package com.overload.server.DTOs.trainers.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginTrainerResponse {

    private Long id;
    private String email;
    private String token;
    private String role;
}
