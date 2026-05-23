package com.overload.server.security;

import com.overload.server.model.Trainer;
import com.overload.server.repo.TrainerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsImplService {

    @Autowired
    private TrainerRepo trainerRepo;

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Trainer trainer = trainerRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new UserDetailsImpl(trainer.getTrainerId(), trainer.getEmail(), trainer.getPasswordHash());
    }
}
