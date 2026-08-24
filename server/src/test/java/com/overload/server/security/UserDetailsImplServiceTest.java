package com.overload.server.security;

import com.overload.server.model.Trainer;
import com.overload.server.repo.TrainerRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.lang.reflect.Field;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsImplServiceTest {

    @Mock
    private TrainerRepo trainerRepo;

    private UserDetailsImplService service;

    @BeforeEach
    void setUp() throws Exception {
        service = new UserDetailsImplService();
        // TrainerRepo is not constructor-injected (missing @RequiredArgsConstructor effect due to no final),
        // so we inject via reflection.
        Field repoField = UserDetailsImplService.class.getDeclaredField("trainerRepo");
        repoField.setAccessible(true);
        repoField.set(service, trainerRepo);
    }

    @Test
    void loadUserByUsername_whenTrainerExists_returnsUserDetailsImpl() {
        Trainer trainer = Trainer.builder()
                .trainerId(10L)
                .email("trainer@gym.com")
                .passwordHash("hashedpw")
                .firstName("John")
                .lastName("Doe")
                .build();
        when(trainerRepo.findByEmail("trainer@gym.com")).thenReturn(Optional.of(trainer));

        UserDetails result = service.loadUserByUsername("trainer@gym.com");

        assertThat(result).isInstanceOf(UserDetailsImpl.class);
        UserDetailsImpl impl = (UserDetailsImpl) result;
        assertThat(impl.getUsername()).isEqualTo("trainer@gym.com");
        assertThat(impl.getPassword()).isEqualTo("hashedpw");
        assertThat(impl.getId()).isEqualTo(10L);
    }

    @Test
    void loadUserByUsername_whenTrainerNotFound_throwsUsernameNotFoundException() {
        when(trainerRepo.findByEmail("missing@gym.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.loadUserByUsername("missing@gym.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User not found");
    }
}
