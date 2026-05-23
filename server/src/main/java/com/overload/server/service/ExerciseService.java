package com.overload.server.service;

import com.overload.server.DTOs.exercises.repsonses.ExerciseResponse;
import com.overload.server.exception.ResourceNotFoundException;
import com.overload.server.model.Exercise;
import com.overload.server.repo.ExerciseRepo;
import com.overload.server.repo.TrainerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepo exerciseRepo;

    @Autowired
    private TrainerRepo trainerRepo;

    public List<ExerciseResponse>  findAllExercisesByTrainerId(long trainerId) {

        if (!trainerRepo.findById(trainerId).isPresent()) {
            throw new ResourceNotFoundException("Trainer not found with id: " + trainerId);
        }

       return exerciseRepo.findByTrainerId(trainerId)
            .stream().map(this::toResponse).toList();
    }


    private ExerciseResponse toResponse(Exercise exercise) {
        ExerciseResponse response = new ExerciseResponse();
        response.setExerciseId(exercise.getExerciseId());
        response.setName(exercise.getName());
        response.setDescription(exercise.getDescription());
        return response;
    }
}
