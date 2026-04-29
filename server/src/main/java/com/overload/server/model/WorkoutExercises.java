package com.overload.server.model;

import java.util.ArrayList;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "workout_exercises")
public class WorkoutExercises {

    @Id
    @GeneratedValue
    private long workoutExercisesId;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private ArrayList<Exercise> exercise;

    @ManyToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @NotNull
    @Column(nullable = false)
    private ArrayList<Integer> exerciseOrder;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Float defaultWeight;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private int defaultReps;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private int defaultSets;
}
