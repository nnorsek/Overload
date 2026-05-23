package com.overload.server.controller;

import com.overload.server.DTOs.exercises.repsonses.ExerciseResponse;
import com.overload.server.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/exercise")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @GetMapping("/all")
    public ResponseEntity<List<ExerciseResponse>> getExercises(@RequestBody long trainerId)
    {
        List<ExerciseResponse> result = exerciseService.findAllExercisesByTrainerId(trainerId);
        return ResponseEntity.ok(result);
    }
}
