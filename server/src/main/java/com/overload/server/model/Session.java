package com.overload.server.model;

import java.time.LocalDateTime;

import com.overload.server.enums.SessionStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter; 

@Entity
@Getter
@Setter
@Table(name = "sessions")
public class Session {
    
    @Id
    @GeneratedValue
    private long session_id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @OneToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout_id;

    @Column(nullable = false)
    @NotNull
    private LocalDateTime scheduled_start;

    @Column(nullable = false)
    @NotNull
    private LocalDateTime scheduled_end;

    @Column(nullable = false)
    @NotBlank
    private SessionStatus status;

    @Column(nullable = false)
    @NotBlank
    private String notes;
}
