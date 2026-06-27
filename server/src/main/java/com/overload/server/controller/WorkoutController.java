package com.overload.server.controller;

import com.overload.server.DTOs.workouts.requests.WorkoutExerciseRequest;
import com.overload.server.DTOs.workouts.requests.WorkoutRequest;
import com.overload.server.DTOs.workouts.responses.WorkoutResponse;
import com.overload.server.security.UserDetailsImpl;
import com.overload.server.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @GetMapping("/all")
    public ResponseEntity<List<WorkoutResponse>> getAllWorkouts(@AuthenticationPrincipal UserDetailsImpl trainer) {
        return ResponseEntity.ok(workoutService.getAllWorkouts(trainer.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponse> getWorkout(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl trainer) {
        return ResponseEntity.ok(workoutService.getWorkout(id, trainer.getId()));
    }

    @PostMapping("/create")
    public ResponseEntity<WorkoutResponse> createWorkout(@Valid @RequestBody WorkoutRequest req, @AuthenticationPrincipal UserDetailsImpl trainer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutService.createWorkout(req, trainer.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponse> updateWorkout(@PathVariable Long id, @Valid @RequestBody WorkoutRequest req, @AuthenticationPrincipal UserDetailsImpl trainer) {
        return ResponseEntity.ok(workoutService.updateWorkout(id, req, trainer.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl trainer) {
        workoutService.deleteWorkout(id, trainer.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/exercises")
    public ResponseEntity<WorkoutResponse> addExercise(@PathVariable Long id, @Valid @RequestBody WorkoutExerciseRequest req, @AuthenticationPrincipal UserDetailsImpl trainer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutService.addExercise(id, req, trainer.getId()));
    }

    @PutMapping("/{workoutId}/exercises/{workoutExerciseId}")
    public ResponseEntity<WorkoutResponse> updateExercise(@PathVariable Long workoutId, @PathVariable Long workoutExerciseId, @Valid @RequestBody WorkoutExerciseRequest req, @AuthenticationPrincipal UserDetailsImpl trainer) {
        return ResponseEntity.ok(workoutService.updateExercise(workoutId, workoutExerciseId, req, trainer.getId()));
    }

    @DeleteMapping("/{workoutId}/exercises/{workoutExerciseId}")
    public ResponseEntity<Void> removeExercise(@PathVariable Long workoutId, @PathVariable Long workoutExerciseId, @AuthenticationPrincipal UserDetailsImpl trainer) {
        workoutService.removeExercise(workoutId, workoutExerciseId, trainer.getId());
        return ResponseEntity.noContent().build();
    }
}
