package org.example.springapp.AI;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.example.springapp.DTO.UserDTO;
import org.example.springapp.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;

@RestController
@RequestMapping("/deepseek")
@RequiredArgsConstructor
public class DeepSeekController {

    private final DeepSeekService deepSeekService;
    private static final Logger logger = LoggerFactory.getLogger(DeepSeekController.class);
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> chat(@RequestParam String prompt) {
        String message = """
                Check if the given text is grammatically and semantically correct English.
                If the text is correct, respond with exactly one word: success
                If the text is incorrect, respond with exactly one word: error
                %s
                """.formatted(prompt);
        logger.info("\n\n\n" + message + "\n\n\n");
        String reply = deepSeekService.askDeepSeek(message);
        return ResponseEntity.ok(reply);
    }

    @GetMapping("/getAiReports")
    public ResponseEntity<?> aiReports() throws JsonProcessingException {
        return ResponseEntity.ok(deepSeekService.findEmployeeOfTheMonth());
    }

    @GetMapping("/getLastWinner")
    public ResponseEntity<?> getLastWinner() throws JsonProcessingException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        UserDTO pm = userService.userByEmail(username);

        LocalDate now = LocalDate.now();
        LocalDate lastDayOfPreviousMonth = YearMonth.from(now).atDay(1).minusDays(1);
        return ResponseEntity.ok(deepSeekService.getLastEmployeeOfTheMonth(pm.getId(), lastDayOfPreviousMonth));
    }

    @GetMapping("/generate-report")
    public ResponseEntity<?> generateReport(@RequestParam("tasks") String tasks) throws JsonProcessingException {
        return ResponseEntity.ok(deepSeekService.generateReport(tasks));
    }
}
