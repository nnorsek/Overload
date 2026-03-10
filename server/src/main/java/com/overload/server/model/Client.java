package com.overload.server.model;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "clients")
public class Client {
    
    @Id
    @GeneratedValue
    private Long client_id;

    @Column(nullable = false)
    @NotBlank
    private String first_name;

    @Column(nullable = false)
    @NotBlank
    private String last_name;

    @Column(nullable = false)
    @NotBlank
    private String email;

    @Column(nullable = false)
    @NotNull
    private LocalDate date_of_birth;

    @Column(nullable = false)
    @NotBlank
    private String gender;

    @Column(nullable = false)
    @NotNull
    @Positive
    private Float starting_weight;

    @Column(nullable = false, columnDefinition = "float default 1.0")
    @NotNull
    @Positive
    private Float current_weight;

    @Column(nullable = false)
    @NotNull
    @Positive
    private Integer height;

    @Column(nullable = false)
    @NotBlank
    private String goal;

    private String photo_url;

    @Column(nullable = false)
    private LocalDateTime started_at;

    @PrePersist
    public void prePersist() {
        if (started_at == null) started_at = LocalDateTime.now();
        if (created_at == null) created_at = Instant.now();
    }

    @Column(nullable = false)
    private Instant created_at;

    private Instant updated_at;


}
