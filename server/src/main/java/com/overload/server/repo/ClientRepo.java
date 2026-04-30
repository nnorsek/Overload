package com.overload.server.repo;

import com.overload.server.DTOs.clients.responses.AllClientsResponse;
import com.overload.server.DTOs.clients.responses.ClientsByTrainerIdResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.overload.server.model.Client;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepo extends JpaRepository<Client, Long> {

    List<Client> findByTrainerTrainerId(long trainerId);

}
