package org.example.springapp.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.example.springapp.DTO.ReportDTO;
import org.example.springapp.Model.Report;
import org.example.springapp.Model.User;
import org.example.springapp.Model.UserRole;
import org.example.springapp.Repository.ReportRepository;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Repository.UserRoleRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class ReportControllerIntegrationTest {

//    @Autowired
//    private UserRepository userRepository;
//    @Autowired
//    private ReportRepository reportRepository;
//    @Autowired
//    private UserRoleRepository userRoleRepository;
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @BeforeAll
//    public void setUp() {
//        UserRole userRole = new UserRole("ROLE_USER");
//        userRoleRepository.save(userRole);
//        UserRole leadRole = new UserRole("ROLE_LEAD");
//        userRoleRepository.save(leadRole);
//
//        User lead = new User();
//        lead.setFirstName("Eve");
//        lead.setSecondName("Davies");
//        lead.setPassword("12345678");
//        lead.setEmail("testlead1@example.com");
//        lead.setDaysForVacation(20);
//        lead.setDaysToSkip(3);
//        lead.setRole(leadRole);
//
//        User lead2 = new User();
//        lead2.setFirstName("Alisson");
//        lead2.setSecondName("Krug");
//        lead2.setPassword("12345678");
//        lead2.setEmail("testlead2@example.com");
//        lead2.setDaysForVacation(20);
//        lead2.setDaysToSkip(3);
//        lead2.setRole(leadRole);
//
//        User user = new User();
//        user.setFirstName("Illia");
//        user.setSecondName("Kamarali");
//        user.setPassword("12345678");
//        user.setEmail("testuser1@example.com");
//        user.setDaysForVacation(20);
//        user.setDaysToSkip(3);
//        user.setRole(userRole);
//        user.setTeamLead(lead);
//
//        User user2 = new User();
//        user2.setFirstName("Steve");
//        user2.setSecondName("Vander");
//        user2.setPassword("12345678");
//        user2.setEmail("testuser2@example.com");
//        user2.setDaysForVacation(20);
//        user2.setDaysToSkip(3);
//        user2.setRole(userRole);
//        user2.setTeamLead(lead2);
//        userRepository.saveAll(List.of(lead, lead2, user, user2));
//
//        Report report1 = new Report(LocalDate.of(2025, 6, 24), "some text",
//                7, user, "work");
//        Report report2 = new Report(LocalDate.of(2025, 6, 25), "some text",
//                7, user, "work");
//        Report report3 = new Report(LocalDate.of(2025, 6, 24), "some text",
//                7, user2, "work");
//        Report report4 = new Report(LocalDate.of(2025, 6, 26), "some text",
//                7, user2, "work");
//
//        reportRepository.saveAll(List.of(report1, report2, report3, report4));
//    }
//
//    @Test
//    @WithMockUser("testuser1@example.com")
//    public void getReport() throws Exception {
//        mockMvc.perform(get("/report/usersReports"))
//                .andDo(print())
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    @WithMockUser("testuser1@example.com")
//    public void getReportByUser() throws Exception {
//        mockMvc.perform(get("/report/usersReports/3"))
//                .andDo(print())
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    @WithMockUser("testuser1@example.com")
//    public void addReport() throws Exception {
//        ReportDTO reportDTO = new ReportDTO();
//        reportDTO.setDate(LocalDate.now());
//        reportDTO.setText("some text");
//        reportDTO.setCountOfHours(7);
//
//        String json = objectMapper.writeValueAsString(reportDTO);
//
//        mockMvc.perform(post("/report/add-report")
//                .content(json)
//                .contentType(MediaType.APPLICATION_JSON))
//                .andDo(print())
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    @WithMockUser("testuser1@example.com")
//    public void updateReport() throws Exception {
//        ReportDTO reportDTO = new ReportDTO();
//        reportDTO.setDate(LocalDate.now());
//        reportDTO.setText("some updated text");
//        reportDTO.setCountOfHours(7);
//
//        String json = objectMapper.writeValueAsString(reportDTO);
//
//        mockMvc.perform(post("/report/update/1")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(json))
//                .andDo(print())
//                .andExpect(status().isOk());
//
//        log.info("\n\nReports: " + reportRepository.findAll() + "\n\n");
//    }
//
//    @Test
//    @WithMockUser("testuser1@example.com")
//    public void deleteReport() throws Exception {
//        mockMvc.perform(post("/report/delete")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("1"))
//                .andDo(print())
//                .andExpect(status().isOk());
//        log.info("\n\nReports: " + reportRepository.findAll() + "\n\n");
//    }
}
