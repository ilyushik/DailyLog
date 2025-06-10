package org.example.springapp.AI;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.springapp.Model.AIAnalysis;
import org.example.springapp.DTO.UserDTO;
import org.example.springapp.DTO.UserReportDTO;
import org.example.springapp.Repository.AIAnalysisRepository;
import org.example.springapp.Repository.ReportRepository;
import org.example.springapp.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class DeepSeekService {

    private final UserService userService;
    private final ReportRepository reportRepository;
    private final AIAnalysisRepository aiAnalysisRepository;

    private static final Logger log = LoggerFactory.getLogger(DeepSeekService.class);

    @Value("${deepseek.api.key}")
    private String apiKey;

    @Value("${deepseek.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String askDeepSeek(String userPrompt) {
        ChatMessage userMessage = new ChatMessage("user", userPrompt);
        ChatRequest request = new ChatRequest("deepseek-chat", List.of(userMessage));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<ChatRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ChatResponse> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                ChatResponse.class
        );

        return response.getBody()
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();
    }

    @Scheduled(cron = "0 0 0 1 * *")
    public List<AIAnalysis> findEmployeeOfTheMonth() throws JsonProcessingException {
        List<AIAnalysis> analysis = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        // yesterday date to get month to find reports
        LocalDate yesterday = LocalDate.now().minusDays(1);
        LocalDate start = YearMonth.from(yesterday).atDay(1);
        LocalDate end = YearMonth.from(yesterday).atEndOfMonth();
        log.info("\nStart date: " + start.toString() + "\nEnd date: " + end.toString() + "\n\n\n");
        for (UserDTO u : userService.users()) {
            // only for PM
            if (u.getPosition().equals("Project Manager")) {
                // list of ids of pm's team
                List<Integer> usersByLead = userService.usersByLead(u.getId())
                        .stream()
                        .map(UserDTO::getId)
                        .toList();

                List<UserReportDTO> reports = reportRepository.findReportsForUsersInMonth("work", usersByLead,
                        start, end).stream().map(r -> {
                            UserReportDTO report =
                                    new UserReportDTO(r.getUser().getFirstName() + " " +
                                            r.getUser().getSecondName(),
                                            r.getText(),
                                            r.getCountOfHours());
                            return report;
                        })
                        .toList();

                String prompt = """
                        Please analyze the list of monthly work reports from the team and identify the most effective 
                        employee of the month based on their activity, quality, and effort.
                        
                        Please return the result in the following JSON format
                        
                        {
                           "winnerFullName": "Name Surname",
                           "reason": "Short reason why this person is the winner"
                           "summary": "Optional short summary of the team's performance (2–3 sentences)"
                        } 
                        
                        Here are the reports:
                        %s
                        """.formatted(reports.toString());

                String result = askDeepSeek(prompt);
                log.info("\n\n\nResult: " + result + "\n\n\n");

                String cleanedJson = result
                        .replaceAll("(?i)```json", "")
                        .replaceAll("```", "")
                        .trim();

                JsonNode root = objectMapper.readTree(cleanedJson);

                String winner = root.get("winnerFullName").asText();
                String reason = root.get("reason").asText();
                String summary = root.get("summary").asText();

                AIAnalysis analyzeDTO =
                        new AIAnalysis(u.getId(), winner, reason, summary, start.getMonthValue(), start.getYear());
                analysis.add(analyzeDTO);

                // save to db
                aiAnalysisRepository.save(analyzeDTO);
            }
        }

        return analysis;
    }

    @Cacheable(value = "winner", unless = "#result == null",
            key = "'pm=' + #pmId + '; month=' + #date.getMonthValue() + '; year=' + #date.getYear()")
    public AIAnalysis getLastEmployeeOfTheMonth(int pmId, LocalDate date) throws JsonProcessingException {
        return aiAnalysisRepository.getAIAnalysisByPmIdAndMonthAndYear(pmId, date.getMonthValue(), date.getYear());
    }

    public String generateReport(String tasks) {
        String prompt = """
                Pls generate a report about completed tasks in 2-3 sentences and return just this text without anything
                additional
                %s
                """.formatted(tasks);
        String result = askDeepSeek(prompt);
        log.info("\n\n\nResult: " + result + "\n\n\n");
        return result;
    }
}
