package com.quizapp.quiz.repository;

import com.quizapp.quiz.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ParticipantRepository extends JpaRepository<Participant, UUID> {
	boolean existsByEmail(String email);
}
