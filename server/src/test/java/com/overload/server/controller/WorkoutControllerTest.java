package com.overload.server.controller;

import com.overload.server.DTOs.workouts.requests.WorkoutExerciseRequest;
import com.overload.server.DTOs.workouts.requests.WorkoutExerciseSetRequest;
import com.overload.server.DTOs.workouts.requests.WorkoutRequest;
import com.overload.server.DTOs.workouts.responses.CreateWorkoutResponse;
import com.overload.server.DTOs.workouts.responses.WorkoutResponse;
import com.overload.server.enums.DifficultyLevel;
import com.overload.server.security.UserDetailsImpl;
import com.overload.server.service.WorkoutService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkoutControllerTest {

    @Mock WorkoutService workoutService;
    @InjectMocks WorkoutController workoutController;

    private final UserDetailsImpl trainer = new UserDetailsImpl(1L, "trainer@test.com", "pass");

    private static final Long WORKOUT_ID = 10L;
    private static final Long WORKOUT_EXERCISE_ID = 30L;

    private WorkoutResponse stubResponse() {
        return new WorkoutResponse(WORKOUT_ID, 1L, "Push Day", "Chest", DifficultyLevel.INTERMEDIATE, 60,
                List.of(), Instant.now(), Instant.now());
    }

    private WorkoutRequest workoutRequest() {
        return new WorkoutRequest("Push Day", "Chest", DifficultyLevel.INTERMEDIATE, 60);
    }

    private WorkoutExerciseRequest exerciseRequest() {
        return new WorkoutExerciseRequest(20L, 1, List.of(new WorkoutExerciseSetRequest(1, 10, 60.0f)));
    }

    // ---- GET /workouts/all ----

    @Test
    void getAllWorkouts_returnsOkWithList() {
        when(workoutService.getAllWorkouts(1L)).thenReturn(List.of(stubResponse()));

        ResponseEntity<List<WorkoutResponse>> response = workoutController.getAllWorkouts(trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        verify(workoutService).getAllWorkouts(1L);
    }

    // ---- GET /workouts/{id} ----

    @Test
    void getWorkout_returnsOkWithResponse() {
        when(workoutService.getWorkout(WORKOUT_ID, 1L)).thenReturn(stubResponse());

        ResponseEntity<WorkoutResponse> response = workoutController.getWorkout(WORKOUT_ID, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().workoutId()).isEqualTo(WORKOUT_ID);
        verify(workoutService).getWorkout(WORKOUT_ID, 1L);
    }

    // ---- POST /workouts/create ----

    @Test
    void createWorkout_returnsCreatedWithId() {
        WorkoutRequest req = workoutRequest();
        when(workoutService.createWorkout(req, 1L)).thenReturn(new CreateWorkoutResponse(WORKOUT_ID));

        ResponseEntity<CreateWorkoutResponse> response = workoutController.createWorkout(req, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().workoutId()).isEqualTo(WORKOUT_ID);
        verify(workoutService).createWorkout(req, 1L);
    }

    // ---- PUT /workouts/{id} ----

    @Test
    void updateWorkout_returnsOkWithUpdatedResponse() {
        WorkoutRequest req = workoutRequest();
        when(workoutService.updateWorkout(WORKOUT_ID, req, 1L)).thenReturn(stubResponse());

        ResponseEntity<WorkoutResponse> response = workoutController.updateWorkout(WORKOUT_ID, req, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        verify(workoutService).updateWorkout(WORKOUT_ID, req, 1L);
    }

    // ---- DELETE /workouts/{id} ----

    @Test
    void deleteWorkout_returnsNoContent() {
        ResponseEntity<Void> response = workoutController.deleteWorkout(WORKOUT_ID, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(workoutService).deleteWorkout(WORKOUT_ID, 1L);
    }

    // ---- POST /workouts/{id}/exercises ----

    @Test
    void addExercise_returnsCreatedWithResponse() {
        WorkoutExerciseRequest req = exerciseRequest();
        when(workoutService.addExercise(WORKOUT_ID, req, 1L)).thenReturn(stubResponse());

        ResponseEntity<WorkoutResponse> response = workoutController.addExercise(WORKOUT_ID, req, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        verify(workoutService).addExercise(WORKOUT_ID, req, 1L);
    }

    // ---- PUT /workouts/{id}/exercises ----

    @Test
    void saveExercises_returnsOkWithResponse() {
        List<WorkoutExerciseRequest> exercises = List.of(exerciseRequest());
        when(workoutService.saveExercises(WORKOUT_ID, exercises, 1L)).thenReturn(stubResponse());

        ResponseEntity<WorkoutResponse> response = workoutController.saveExercises(WORKOUT_ID, exercises, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        verify(workoutService).saveExercises(WORKOUT_ID, exercises, 1L);
    }

    // ---- PUT /workouts/{workoutId}/exercises/{workoutExerciseId} ----

    @Test
    void updateExercise_returnsOkWithResponse() {
        WorkoutExerciseRequest req = exerciseRequest();
        when(workoutService.updateExercise(WORKOUT_ID, WORKOUT_EXERCISE_ID, req, 1L)).thenReturn(stubResponse());

        ResponseEntity<WorkoutResponse> response = workoutController.updateExercise(WORKOUT_ID, WORKOUT_EXERCISE_ID, req, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        verify(workoutService).updateExercise(WORKOUT_ID, WORKOUT_EXERCISE_ID, req, 1L);
    }

    // ---- DELETE /workouts/{workoutId}/exercises/{workoutExerciseId} ----

    @Test
    void removeExercise_returnsNoContent() {
        ResponseEntity<Void> response = workoutController.removeExercise(WORKOUT_ID, WORKOUT_EXERCISE_ID, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(workoutService).removeExercise(WORKOUT_ID, WORKOUT_EXERCISE_ID, 1L);
    }
}
