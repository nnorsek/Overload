package com.overload.server.DTOs.clients.responses;

import com.overload.server.DTOs.clients.requests.CreateClientRequest;
import com.overload.server.model.Client;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateClientResponse {
    private Long clientId;
    private String firstName;
    private String lastName;
    private String email;
    private Float startingWeight;
    private Integer height;
    private String gender;
    private String token;
}

