package com.overload.server.controller;

import com.overload.server.DTOs.exercises.repsonses.ExerciseResponse;
import com.overload.server.DTOs.exercises.requests.CreateExerciseRequest;
import com.overload.server.security.UserDetailsImpl;
import com.overload.server.service.ExerciseService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/exercises")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @GetMapping("/all")
    public ResponseEntity<List<ExerciseResponse>> getExercises(@AuthenticationPrincipal UserDetailsImpl trainer)
    {
        Long trainerId = trainer.getId();
        return ResponseEntity.ok(exerciseService.findAllExercisesByTrainerId(trainerId));
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createExercise(@Valid @RequestBody CreateExerciseRequest req, @AuthenticationPrincipal UserDetailsImpl trainer) {
        exerciseService.createExercise(req, trainer.getId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl trainer) {
        exerciseService.deleteExercise(id, trainer.getId());
        return ResponseEntity.noContent().build();
    }
}

