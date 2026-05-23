package com.overload.server.service;

import com.overload.server.DTOs.exercises.repsonses.ExerciseResponse;
import com.overload.server.DTOs.exercises.requests.CreateExerciseRequest;
import com.overload.server.exception.ResourceNotFoundException;
import com.overload.server.model.Exercise;
import com.overload.server.model.Trainer;
import com.overload.server.repo.ExerciseRepo;
import com.overload.server.repo.TrainerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepo exerciseRepo;

    @Autowired
    private TrainerRepo trainerRepo;

    public List<ExerciseResponse> findAllExercisesByTrainerId(Long trainerId) {

        if (!trainerRepo.findById(trainerId).isPresent()) {
            throw new ResourceNotFoundException("Trainer not found with id: " + trainerId);
        }

       return exerciseRepo.findByTrainer_TrainerId(trainerId)
            .stream().map(this::toResponse).toList();
    }

    public void createExercise(CreateExerciseRequest request, Long trainerId) {
        if (exerciseRepo.existsByName(request.getName(), trainerId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Exercise already exists");
        }

        Trainer trainer = trainerRepo.findById(trainerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trainer not found"));

        Exercise exercise = Exercise.builder()
                .name(request.getName())
                .muscleGroup(request.getMuscleGroup())
                .description(request.getDescription())
                .equipmentType(request.getEquipmentType())
                .trainer(trainer)
                .build();

        exerciseRepo.save(exercise);
    }


    private ExerciseResponse toResponse(Exercise exercise) {
        ExerciseResponse response = new ExerciseResponse();
        response.setExerciseId(exercise.getExerciseId());
        response.setName(exercise.getName());
        response.setDescription(exercise.getDescription());
        return response;
    }
}
