package com.overload.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.overload.server.model.Client;

@Repository
public interface ClientRepo extends JpaRepository<Client, Long> {
}
