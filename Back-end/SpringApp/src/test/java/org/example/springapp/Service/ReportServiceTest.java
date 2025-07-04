package org.example.springapp.Service;

import org.example.springapp.DTO.AddReportReturnDTO;
import org.example.springapp.DTO.PeriodReport;
import org.example.springapp.DTO.ReportDTO;
import org.example.springapp.Model.Report;
import org.example.springapp.Model.User;
import org.example.springapp.Model.UserRole;
import org.example.springapp.Repository.ReportRepository;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.util.CustomObjectMappers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @InjectMocks
    private ReportService reportService;

    @Mock
    private CustomObjectMappers customObjectMappers;

    @Spy
    @InjectMocks
    private ReportService reportServiceSpy;

    @Test
    void getReportsByUserId() {
        UserRole leadRole = new UserRole("ROLE_LEAD");
        User user1 = new User(4, "Illia", "Kamarali", "password005",
                "kamarali2025mf12@student.karazin.ua",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        user1.setId(1);
        User user2 = new User(4, "Eve", "Davis", "password005",
                "kamarali2025mf12@student.karazin.ua",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        user2.setId(2);
        Report report1 = new Report(LocalDate.of(2025, 4, 28), "pls...", 7,
                user1, "work");
        ReportDTO reportDTO1 = new ReportDTO(LocalDate.of(2025, 4, 28), "pls...",
                7, 1, "work");
        Report report2 = new Report(LocalDate.of(2025, 4, 28), "pls...", 7,
                user2, "work");
        ReportDTO reportDTO2 = new ReportDTO(LocalDate.of(2025, 4, 28), "pls...",
                7, 2, "work");

        Mockito.when(reportRepository.findAll()).thenReturn(List.of(report1, report2));
        Mockito.when(customObjectMappers.reportToDto(report1)).thenReturn(reportDTO1);

        List<ReportDTO> gotten = reportService.getReportsByUserId(user1.getId());
        assertEquals(gotten, List.of(reportDTO1));

    }

    @Test
    void reportById() {
        UserRole leadRole = new UserRole("ROLE_LEAD");
        User user1 = new User(4, "Illia", "Kamarali", "password005",
                "kamarali2025mf12@student.karazin.ua",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        user1.setId(1);
        User user2 = new User(4, "Eve", "Davis", "password005",
                "kamarali2025mf12@student.karazin.ua",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        user2.setId(2);
        Report report1 = new Report(LocalDate.of(2025, 4, 28), "pls...", 7,
                user1, "work");
        ReportDTO reportDTO1 = new ReportDTO(LocalDate.of(2025, 4, 28), "pls...",
                7, 1, "work");
        report1.setId(1);
        reportDTO1.setId(1);
        Report report2 = new Report(LocalDate.of(2025, 4, 28), "pls...", 7,
                user2, "work");
        ReportDTO reportDTO2 = new ReportDTO(LocalDate.of(2025, 4, 28), "pls...",
                7, 2, "work");
        report2.setId(2);
        reportDTO2.setId(2);

        Mockito.when(reportRepository.findById(1)).thenReturn(Optional.of(report1));
        Mockito.when(customObjectMappers.reportToDto(report1)).thenReturn(reportDTO1);

        ReportDTO gotten = reportService.reportById(report1.getId());
        assertEquals(gotten, reportDTO1);
    }

    @Test
    void addReport() {
        UserRole leadRole = new UserRole("ROLE_LEAD");
        User user1 = new User(4, "Illia", "Kamarali", "password005",
                "kamarali2025mf12@student.karazin.ua",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        user1.setId(1);
        user1.setDaysForVacation(20);
        Report report1 = new Report(LocalDate.of(2025, 4, 28), "pls...", 7,
                user1, "work");
        report1.setId(1);
        ReportDTO reportDTO1 = new ReportDTO(LocalDate.of(2025, 4, 28), "pls...",
                7, 1, "work");

        Mockito.when(reportRepository.save(Mockito.any(Report.class))).thenReturn(report1);
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(user1);
        ValueOperations<String, Object> valueOperations = Mockito.mock(ValueOperations.class);
        Mockito.when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        AddReportReturnDTO gotten = reportServiceSpy.addReport(reportDTO1, user1);
        assertEquals(gotten.getUserEmail(), user1.getEmail());
        assertEquals(gotten.getDays(), user1.getDaysForVacation());

    }

    @Test
    void getAllReportsByUserPerPeriod() {
        PeriodReport periodReport = new PeriodReport(LocalDate.of(2025, 4, 1),
                LocalDate.of(2025, 4, 30));
        UserRole leadRole = new UserRole("ROLE_LEAD");
        User user1 = new User(4, "Illia", "Kamarali", "password005",
                "kamarali2025mf12@student.karazin.ua",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        user1.setId(1);
        user1.setDaysForVacation(20);
        Report report1 = new Report(LocalDate.of(2025, 4, 28), "pls...", 7,
                user1, "work");
        report1.setId(1);
        ReportDTO reportDTO1 = new ReportDTO(LocalDate.of(2025, 4, 28), "pls...",
                7, 1, "work");
        Report report2 = new Report(LocalDate.of(2025, 5, 28), "pls...", 7,
                user1, "work");
        ReportDTO reportDTO2 = new ReportDTO(LocalDate.of(2025, 5, 28), "pls...",
                7, 1, "work");
        report2.setId(2);
        reportDTO2.setId(2);

        Mockito.when(reportRepository.findAll()).thenReturn(List.of(report1, report2));
        Mockito.when(customObjectMappers.reportToDto(report1)).thenReturn(reportDTO1);
        Mockito.when(customObjectMappers.reportToDto(report2)).thenReturn(reportDTO2);

        List<ReportDTO> gotten = reportServiceSpy.getAllReportsByUserPerPeriod(1, periodReport);
        assertEquals(gotten, List.of(reportDTO1));
    }

    @Test
    void updateReport() {
        UserRole leadRole = new UserRole("ROLE_LEAD");
        User user1 = new User(4, "Illia", "Kamarali", "password005",
                "kamarali2025mf12@student.karazin.ua",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        user1.setId(1);
        user1.setDaysForVacation(20);
        Report report1 = new Report(LocalDate.of(2025, 4, 28), "pls...", 7,
                user1, "work");
        report1.setId(1);
        ReportDTO reportDTO1 = new ReportDTO(LocalDate.of(2025, 4, 28), "pls...",
                7, 1, "work");
        Report report2 = new Report(LocalDate.of(2025, 5, 28), "pls...", 7,
                user1, "work");
        ReportDTO reportDTO2 = new ReportDTO(LocalDate.of(2025, 5, 28), "pls...",
                7, 1, "work");
        report2.setId(1);
        reportDTO2.setId(1);

        Mockito.when(reportRepository.findById(1)).thenReturn(Optional.of(report1));
        Mockito.when(reportRepository.save(Mockito.any(Report.class))).thenReturn(report2);

        Report gotten = reportServiceSpy.updateReport(reportDTO2, 1, customObjectMappers.userToDto(user1));
        assertEquals(gotten, report2);
    }

    @Test
    void deleteReport() {
        String gotten = reportServiceSpy.deleteReport(1,1);
        assertEquals(gotten,"Report deleted");
    }
}