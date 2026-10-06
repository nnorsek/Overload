package com.overload.server.config;

import com.overload.server.DTOs.trainers.requests.LoginTrainerRequest;
import com.overload.server.DTOs.trainers.responses.LoginTrainerResponse;
import com.overload.server.service.ClientService;
import com.overload.server.service.ExerciseService;
import com.overload.server.service.SessionService;
import com.overload.server.service.TrainerService;
import com.overload.server.service.WorkoutService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = "overload.mock-data.enabled=true")
// Keeps a persistence session open like a web request does, so lazy collections can load.
@Transactional
class MockDataLoaderTest {

    @Autowired private TrainerService trainerService;
    @Autowired private ClientService clientService;
    @Autowired private ExerciseService exerciseService;
    @Autowired private WorkoutService workoutService;
    @Autowired private SessionService sessionService;

    private Long trainerId;

    @BeforeEach
    void logInAsMockTrainer() {
        LoginTrainerResponse login = trainerService.loginTrainer(
                new LoginTrainerRequest(MockDataLoader.TRAINER_EMAIL, MockDataLoader.PASSWORD));
        trainerId = login.id();
    }

    @Test
    void mockTrainerCanLogIn() {
        assertThat(trainerId).isNotNull();
    }

    @Test
    void mockTrainerHasClients() {
        assertThat(clientService.getAllClientByTrainerId(trainerId)).isNotEmpty();
    }

    @Test
    void mockTrainerSeesExercises() {
        assertThat(exerciseService.findAllExercisesByTrainerId(trainerId)).isNotEmpty();
    }

    @Test
    void mockTrainerHasWorkouts() {
        assertThat(workoutService.getAllWorkouts(trainerId)).isNotEmpty();
    }

    @Test
    void mockTrainerHasSessions() {
        assertThat(sessionService.getSessions(trainerId)).isNotEmpty();
    }
}
