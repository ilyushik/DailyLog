package org.example.springapp.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.example.springapp.DTO.RequestDTO;
import org.example.springapp.Model.*;
import org.example.springapp.Repository.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private RequestStatusRepository requestStatusRepository;
    @Autowired
    private ApproverActionRepository approverActionRepository;
    @Autowired
    private RequestReasonRepository requestReasonRepository;

    @BeforeAll
    public void init() {
        RequestStatus status = new RequestStatus("Pending");
        requestStatusRepository.save(status);
        ApproverAction action = new ApproverAction("Unchecked");
        approverActionRepository.save(action);
        RequestReason reason = new RequestReason("Sick Leave");
        requestReasonRepository.save(reason);
        UserRole lead =  new UserRole("ROLE_LEAD");
        UserRole userRole = new UserRole("ROLE_USER");
        userRoleRepository.saveAll(List.of(userRole, lead));

        User leadUser = new User();
        leadUser.setEmail("testlead@example.com");
        leadUser.setDaysForVacation(20);
        leadUser.setDaysToSkip(3);
        leadUser.setRole(userRole);
        userRepository.save(leadUser);

        User user = new User();
        user.setEmail("test@example.com");
        user.setDaysForVacation(20);
        user.setDaysToSkip(3);
        user.setRole(userRole);
        user.setTeamLead(leadUser);
        userRepository.save(user);
    }

    @BeforeEach
    public void setUp() {
    }

    @Test
    @WithMockUser(username = "test@example.com")
    public void addRequest() throws Exception {
        RequestDTO requestDTO = new RequestDTO();
        requestDTO.setStartDate(LocalDate.of(2025, 7, 14));
        requestDTO.setFinishDate(LocalDate.of(2025, 7, 14));
        requestDTO.setReason("Sick Leave");
        requestDTO.setComment("integration test");

        String json = objectMapper.writeValueAsString(requestDTO);

        mockMvc.perform(post("/addRequest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        log.info("\n\n\nAmount of requests: " + requestRepository.findAll().size() + "\n\n\n");

        Assertions.assertEquals(1, requestRepository.findAll().size());
    }
}
