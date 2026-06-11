package com.overload.server.model;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/*
 * ClientWorkout is the assignment record linking a Client to a Workout.
 * Because Workout is a reusable template, the same workout can be assigned
 * to many clients, and a client can have many workouts assigned to them.
 * This table is the bridge that makes that many-to-many relationship explicit,
 * while also recording when the assignment was made.
 *
 * Relationships:
 *   - ManyToOne -> Client  (the client receiving the workout)
 *   - ManyToOne -> Workout (the workout being assigned)
 */
@Entity
@Getter
@Setter
@Table(name = "client_workouts")
public class ClientWorkout {

    @Id
    @GeneratedValue
    private Long clientWorkoutId;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @Column(nullable = false, updatable = false)
    private Instant assignedAt;

    @PrePersist
    public void onCreate() {
        assignedAt = Instant.now();
    }
}
