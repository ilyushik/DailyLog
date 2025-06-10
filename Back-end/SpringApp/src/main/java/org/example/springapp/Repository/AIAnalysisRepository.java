package org.example.springapp.Repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.example.springapp.Model.AIAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, Integer> {
    public AIAnalysis getAIAnalysisByPmIdAndMonthAndYear(int pmId, int month, int year) throws JsonProcessingException;
}
