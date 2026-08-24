package com.overload.server.validations;

import com.overload.server.DTOs.sessions.requests.CreateSessionRequest;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ValidSessionScheduleValidatorTest {

    private final ValidSessionScheduleValidator validator = new ValidSessionScheduleValidator();

    private static final LocalDateTime START = LocalDateTime.now().plusDays(1);
    private static final LocalDateTime END = START.plusHours(1);

    @Test
    void valid_whenEndIsAfterStart() {
        assertThat(validator.isValid(req(START, END), null)).isTrue();
    }

    @Test
    void invalid_whenEndIsBeforeStart() {
        assertThat(validator.isValid(req(END, START), null)).isFalse();
    }

    @Test
    void invalid_whenEndEqualsStart() {
        assertThat(validator.isValid(req(START, START), null)).isFalse();
    }

    @Test
    void valid_whenStartIsNull() {
        assertThat(validator.isValid(req(null, END), null)).isTrue();
    }

    @Test
    void valid_whenEndIsNull() {
        assertThat(validator.isValid(req(START, null), null)).isTrue();
    }

    private CreateSessionRequest req(LocalDateTime start, LocalDateTime end) {
        return new CreateSessionRequest(List.of(1L), 1L, start, end, null);
    }
}
