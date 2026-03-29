package com.overload.server.model;

import java.util.ArrayList;

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
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder.Default;

@Getter
@Setter
@Entity
@Table(name = "workout_exercises")
public class WorkoutExercises {
    
    @Id
    @GeneratedValue
    private long workout_exercises_id;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private ArrayList<Exercise> exercise;

    @OneToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @NotNull
    @Column(nullable = false)
    private ArrayList<Integer> exercise_order;


    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Float default_weight;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private int default_reps;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private int default_sets;
}
