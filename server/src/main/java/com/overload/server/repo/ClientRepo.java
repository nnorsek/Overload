package com.overload.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.overload.server.model.Client;

import java.util.List;

@Repository
public interface ClientRepo extends JpaRepository<Client, Long> {

    List<Client> findByTrainerTrainerId(long trainerId);

}
