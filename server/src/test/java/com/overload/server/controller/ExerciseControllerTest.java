package com.overload.server.controller;

import com.overload.server.DTOs.exercises.repsonses.ExerciseResponse;
import com.overload.server.DTOs.exercises.requests.CreateExerciseRequest;
import com.overload.server.DTOs.exercises.requests.UpdateExerciseRequest;
import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.ExerciseCategory;
import com.overload.server.enums.MuscleGroup;
import com.overload.server.security.UserDetailsImpl;
import com.overload.server.service.ExerciseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExerciseControllerTest {

    @Mock ExerciseService exerciseService;
    @InjectMocks ExerciseController exerciseController;

    private static final Long TRAINER_ID = 1L;
    private static final Long EXERCISE_ID = 10L;

    private UserDetailsImpl principal;
    private ExerciseResponse exerciseResponse;
    private CreateExerciseRequest createRequest;
    private UpdateExerciseRequest updateRequest;

    @BeforeEach
    void setUp() {
        principal = new UserDetailsImpl(TRAINER_ID, "trainer@example.com", "password");

        exerciseResponse = new ExerciseResponse(
                EXERCISE_ID,
                "Bench Press",
                EquipmentType.BARBELL,
                MuscleGroup.CHEST,
                ExerciseCategory.STRENGTH,
                "Chest compound",
                TRAINER_ID,
                null
        );

        createRequest = new CreateExerciseRequest(
                "Squat",
                "Leg compound",
                ExerciseCategory.STRENGTH,
                EquipmentType.BARBELL,
                MuscleGroup.LEGS
        );

        updateRequest = new UpdateExerciseRequest(
                "Updated Squat",
                "Updated description",
                EquipmentType.DUMBBELL,
                MuscleGroup.LEGS,
                ExerciseCategory.STRENGTH
        );
    }

    @Test
    void getExercises_returnsOkWithExerciseList() {
        when(exerciseService.findAllExercisesByTrainerId(TRAINER_ID)).thenReturn(List.of(exerciseResponse));

        ResponseEntity<List<ExerciseResponse>> response = exerciseController.getExercises(principal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).exerciseId()).isEqualTo(EXERCISE_ID);
        verify(exerciseService).findAllExercisesByTrainerId(TRAINER_ID);
    }

    @Test
    void createExercise_returnsCreated() {
        ResponseEntity<Void> response = exerciseController.createExercise(createRequest, principal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        verify(exerciseService).createExercise(createRequest, TRAINER_ID);
    }

    @Test
    void deleteExercise_returnsNoContent() {
        ResponseEntity<Void> response = exerciseController.deleteExercise(EXERCISE_ID, principal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(exerciseService).deleteExercise(EXERCISE_ID, TRAINER_ID);
    }

    @Test
    void updateExercise_returnsOkWithUpdatedExercise() {
        when(exerciseService.updateExercise(updateRequest, EXERCISE_ID, TRAINER_ID)).thenReturn(exerciseResponse);

        ResponseEntity<ExerciseResponse> response = exerciseController.updateExercise(EXERCISE_ID, principal, updateRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(exerciseResponse);
        verify(exerciseService).updateExercise(updateRequest, EXERCISE_ID, TRAINER_ID);
    }
}
