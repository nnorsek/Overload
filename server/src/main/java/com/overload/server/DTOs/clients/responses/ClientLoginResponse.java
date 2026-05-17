package com.overload.server.DTOs.clients.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class ClientLoginResponse {
    private Long clientId;
    private String email;
    private String token;
    private String role;
}
