package com.quizapp.quiz.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class SubmitQuizRequest {

    @NotNull
    private UUID participantId;

    @NotNull
    private List<AnswerItem> answers;

    @NotNull
    private Integer timeTakenSeconds;

    public UUID getParticipantId() { return participantId; }
    public void setParticipantId(UUID participantId) { this.participantId = participantId; }

    public List<AnswerItem> getAnswers() { return answers; }
    public void setAnswers(List<AnswerItem> answers) { this.answers = answers; }

    public Integer getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(Integer timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }

    public static class AnswerItem {
        private Integer questionId;
        private String selectedOption; // "A" | "B" | "C" | "D"

        public Integer getQuestionId() { return questionId; }
        public void setQuestionId(Integer questionId) { this.questionId = questionId; }

        public String getSelectedOption() { return selectedOption; }
        public void setSelectedOption(String selectedOption) { this.selectedOption = selectedOption; }
    }
}
