package com.quizapp.quiz.dto;

import com.quizapp.quiz.model.Question;

public class QuestionPublicDto {
	private Integer id;
	private String questionText;
	private String optionA;
	private String optionB;
	private String optionC;
	private String optionD;
	private Integer orderIndex;

	public static QuestionPublicDto from(Question q) {
		QuestionPublicDto dto = new QuestionPublicDto();
		dto.id = q.getId();
		dto.questionText = q.getQuestionText();
		dto.optionA = q.getOptionA();
		dto.optionB = q.getOptionB();
		dto.optionC = q.getOptionC();
		dto.optionD = q.getOptionD();
		dto.orderIndex = q.getOrderIndex();
		return dto;
	}

	public Integer getId() {
		return id;
	}

	public String getQuestionText() {
		return questionText;
	}

	public String getOptionA() {
		return optionA;
	}

	public String getOptionB() {
		return optionB;
	}

	public String getOptionC() {
		return optionC;
	}

	public String getOptionD() {
		return optionD;
	}

	public Integer getOrderIndex() {
		return orderIndex;
	}
}
