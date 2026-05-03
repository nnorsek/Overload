package com.overload.server.DTOs.clients.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ClientLoginRequest {

    @Email
    @NotNull
    private String email;

    @Size(min = 7, max = 72)
    private String password;
}
