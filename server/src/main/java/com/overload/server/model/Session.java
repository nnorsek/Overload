package com.overload.server.model;

import java.time.LocalDateTime;

import com.overload.server.enums.SessionStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/*
 * Session is a scheduled training appointment between a Client and a Trainer.
 * It references a Workout template to define what exercises will be performed.
 * The actual per-exercise performance is recorded in SessionExercises rows
 * that link back to this Session.
 *
 * Relationships:
 *   - ManyToOne -> Client   (the client attending this session)
 *   - ManyToOne -> Trainer  (the trainer running this session)
 *   - ManyToOne -> Workout  (the workout template being performed; reusable across sessions)
 *   - OneToMany <- SessionExercises (the actual exercise performance for this session)
 */
@Entity
@Getter
@Setter
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue
    private Long sessionId;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @Column(nullable = false)
    @NotNull
    private LocalDateTime scheduledStart;

    @Column(nullable = false)
    @NotNull
    private LocalDateTime scheduledEnd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull
    private SessionStatus status;

    @Column
    private String notes;

}
