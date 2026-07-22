package com.quizapp.quiz.dto;

import java.util.UUID;

public class QuizResultResponse {
	private UUID submissionId;
	private Integer score;
	private Integer totalQuestions;
	private Integer timeTakenSeconds;
	private Long rank; // 1-based overall rank

	public QuizResultResponse(UUID submissionId, Integer score, Integer totalQuestions, Integer timeTakenSeconds,
			Long rank) {
		this.submissionId = submissionId;
		this.score = score;
		this.totalQuestions = totalQuestions;
		this.timeTakenSeconds = timeTakenSeconds;
		this.rank = rank;
	}

	public UUID getSubmissionId() {
		return submissionId;
	}

	public Integer getScore() {
		return score;
	}

	public Integer getTotalQuestions() {
		return totalQuestions;
	}

	public Integer getTimeTakenSeconds() {
		return timeTakenSeconds;
	}

	public Long getRank() {
		return rank;
	}
}
