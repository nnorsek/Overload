package com.overload.server.DTOs.clients.responses;

import com.overload.server.DTOs.clients.requests.CreateClientRequest;
import com.overload.server.model.Client;

public class CreateClientResponse {

    private Long clientId;
    private String firstName;
    private String lastName;
    private String email;
    private Float startingWeight;
    private Integer height;
    private String gender;
    private String photoUrl;

    public CreateClientResponse(Client client) {
        this.clientId = client.getClientId();
        this.firstName = client.getFirstName();
        this.lastName = client.getLastName();
        this.email = client.getEmail();
        this.startingWeight = client.getStartingWeight();
        this.height = client.getHeight();
        this.gender = client.getGender();
        this.photoUrl = client.getPhotoUrl();
    }
}
