package com.overload.server.utils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class JwtUtilTest {

    private JwtUtil jwtUtil;

    // Must be at least 32 bytes (256 bits) for HMAC-SHA256
    private static final String TEST_SECRET = "test-secret-key-that-is-long-enough-for-hmac";
    private static final long TEST_EXPIRATION = 3_600_000L; // 1 hour

    @BeforeEach
    void setUp() throws Exception {
        jwtUtil = new JwtUtil();
        setField(jwtUtil, "secret", TEST_SECRET);
        setField(jwtUtil, "expiration", TEST_EXPIRATION);
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    void generateToken_withValidInputs_returnsNonNullToken() {
        String token = jwtUtil.generateToken("user@example.com", "ROLE_TRAINER", 1L);

        assertThat(token).isNotNull().isNotBlank();
    }

    @Test
    void generateToken_withValidInputs_embedsEmailAsSubject() {
        String token = jwtUtil.generateToken("user@example.com", "ROLE_TRAINER", 1L);

        assertThat(jwtUtil.extractEmail(token)).isEqualTo("user@example.com");
    }

    @Test
    void generateToken_withValidInputs_embedsRoleClaim() {
        String token = jwtUtil.generateToken("user@example.com", "ROLE_CLIENT", 42L);

        assertThat(jwtUtil.extractRole(token)).isEqualTo("ROLE_CLIENT");
    }

    @Test
    void generateToken_withValidInputs_embedsIdClaim() {
        String token = jwtUtil.generateToken("user@example.com", "ROLE_TRAINER", 99L);

        assertThat(jwtUtil.extractId(token)).isEqualTo(99L);
    }

    @Test
    void extractEmail_roundTrip_returnsOriginalEmail() {
        String email = "trainer@gym.com";
        String token = jwtUtil.generateToken(email, "ROLE_TRAINER", 7L);

        assertThat(jwtUtil.extractEmail(token)).isEqualTo(email);
    }

    @Test
    void extractRole_roundTrip_returnsOriginalRole() {
        String token = jwtUtil.generateToken("a@b.com", "ROLE_CLIENT", 3L);

        assertThat(jwtUtil.extractRole(token)).isEqualTo("ROLE_CLIENT");
    }

    @Test
    void extractId_roundTrip_returnsOriginalId() {
        String token = jwtUtil.generateToken("a@b.com", "ROLE_TRAINER", 55L);

        assertThat(jwtUtil.extractId(token)).isEqualTo(55L);
    }

    @Test
    void isTokenValid_withFreshToken_returnsTrue() {
        String token = jwtUtil.generateToken("valid@test.com", "ROLE_TRAINER", 1L);

        assertThat(jwtUtil.isTokenValid(token)).isTrue();
    }

    @Test
    void isTokenValid_withTamperedToken_returnsFalse() {
        String token = jwtUtil.generateToken("valid@test.com", "ROLE_TRAINER", 1L);
        String tampered = token.substring(0, token.length() - 4) + "XXXX";

        assertThat(jwtUtil.isTokenValid(tampered)).isFalse();
    }

    @Test
    void isTokenValid_withCompletelyInvalidString_returnsFalse() {
        assertThat(jwtUtil.isTokenValid("not.a.jwt")).isFalse();
    }

    @Test
    void isTokenValid_withEmptyString_returnsFalse() {
        assertThat(jwtUtil.isTokenValid("")).isFalse();
    }
}
