package com.overload.server.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class UserDetailsImplTest {

    private final UserDetailsImpl userDetails = new UserDetailsImpl(1L, "trainer@gym.com", "hashed-password");

    @Test
    void getUsername_returnsEmail() {
        assertThat(userDetails.getUsername()).isEqualTo("trainer@gym.com");
    }

    @Test
    void getPassword_returnsPassword() {
        assertThat(userDetails.getPassword()).isEqualTo("hashed-password");
    }

    @Test
    void getAuthorities_returnsEmptyCollection() {
        assertThat(userDetails.getAuthorities()).isEmpty();
    }

    @Test
    void isAccountNonExpired_returnsTrue() {
        assertThat(userDetails.isAccountNonExpired()).isTrue();
    }

    @Test
    void isAccountNonLocked_returnsTrue() {
        assertThat(userDetails.isAccountNonLocked()).isTrue();
    }

    @Test
    void isCredentialsNonExpired_returnsTrue() {
        assertThat(userDetails.isCredentialsNonExpired()).isTrue();
    }

    @Test
    void isEnabled_returnsTrue() {
        assertThat(userDetails.isEnabled()).isTrue();
    }
}
