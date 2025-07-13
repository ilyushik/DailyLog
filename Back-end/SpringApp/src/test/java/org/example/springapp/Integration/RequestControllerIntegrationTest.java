package org.example.springapp.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.example.springapp.DTO.RequestDTO;
import org.example.springapp.Model.*;
import org.example.springapp.Repository.*;
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
public class RequestControllerIntegrationTest {

//    @Autowired
//    private UserRepository userRepository;
//    @Autowired
//    private UserRoleRepository userRoleRepository;
//    @Autowired
//    private RequestRepository requestRepository;
//    @Autowired
//    private RequestStatusRepository requestStatusRepository;
//    @Autowired
//    private RequestReasonRepository requestReasonRepository;
//    @Autowired
//    private ApproverActionRepository approverActionRepository;
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @BeforeAll
//    public void setup() {
//        UserRole userRole = new UserRole("ROLE_USER");
//        userRoleRepository.save(userRole);
//        UserRole leadRole = new UserRole("ROLE_LEAD");
//        userRoleRepository.save(leadRole);
//        RequestStatus pending = new RequestStatus("Pending");
//        RequestStatus approved = new RequestStatus("Approved");
//        RequestStatus declined = new RequestStatus("declined");
//        requestStatusRepository.saveAll(List.of(pending, approved, declined));
//        RequestReason sickLeave = new RequestReason("Sick Leave");
//        requestReasonRepository.save(sickLeave);
//        RequestReason annualLeave = new RequestReason("Annual Leave");
//        requestReasonRepository.save(annualLeave);
//        RequestReason personalLeave = new RequestReason("Personal Leave");
//        requestReasonRepository.save(personalLeave);
//        ApproverAction unchecked = new ApproverAction("Unchecked");
//        ApproverAction approve = new ApproverAction("Approve");
//        ApproverAction decline = new ApproverAction("Decline");
//        approverActionRepository.saveAll(List.of(unchecked, approve, decline));
//
//
//        User lead = new User();
//        lead.setFirstName("Eve");
//        lead.setSecondName("Davies");
//        lead.setPassword("12345678");
//        lead.setEmail("testlead@example.com");
//        lead.setDaysForVacation(20);
//        lead.setDaysToSkip(3);
//        lead.setRole(leadRole);
//        userRepository.save(lead);
//
//        User lead2 = new User();
//        lead2.setFirstName("Alisson");
//        lead2.setSecondName("Krug");
//        lead2.setPassword("12345678");
//        lead2.setEmail("testlead1@example.com");
//        lead2.setDaysForVacation(20);
//        lead2.setDaysToSkip(3);
//        lead2.setRole(leadRole);
//        userRepository.save(lead2);
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
//        userRepository.save(user);
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
//        userRepository.save(user2);
//
//        Request request1 = new Request();
//        request1.setStartDate(LocalDate.now());
//        request1.setFinishDate(LocalDate.now().plusDays(1));
//        request1.setUniqueCode("dfsdfew5");
//        request1.setApproverId(lead);
//        request1.setUser(user);
//        request1.setReason(sickLeave);
//        request1.setStatus(pending);
//        request1.setAction(unchecked);
//        request1.setComment("integration test...");
//
//        Request request2 = new Request();
//        request2.setStartDate(LocalDate.now().plusDays(1));
//        request2.setFinishDate(LocalDate.now().plusDays(1));
//        request2.setUniqueCode("dferfew5");
//        request2.setApproverId(lead2);
//        request2.setUser(user2);
//        request2.setReason(sickLeave);
//        request2.setStatus(pending);
//        request2.setAction(unchecked);
//        request2.setComment("integration test...");
//
//        Request request3 = new Request();
//        request3.setStartDate(LocalDate.now().plusDays(7));
//        request3.setFinishDate(LocalDate.now().plusDays(14));
//        request3.setUniqueCode("dswdfew5");
//        request3.setApproverId(lead);
//        request3.setUser(user);
//        request3.setReason(annualLeave);
//        request3.setStatus(pending);
//        request3.setAction(unchecked);
//        request3.setComment("integration test...");
//
//        requestRepository.saveAll(List.of(request1, request2, request3));
//
//    }
//
//    @Test
//    @WithMockUser("testuser2@example.com")
//    public void requestByUser() throws Exception {
//        mockMvc.perform(get("/requests"))
//                .andDo(print())
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    @WithMockUser(value = "testlead@example.com", roles = "LEAD")
//    public void requestByUserId() throws Exception {
//        mockMvc.perform(get("/requests/userRequests/3"))
//                .andDo(print())
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    @WithMockUser(value = "testlead@example.com", roles = {"LEAD"})
//    public void requestsByApprover() throws Exception {
//        mockMvc.perform(get("/requests/approver"))
//                .andDo(print())
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    @WithMockUser(value = "testlead@example.com", roles = {"LEAD"})
//    public void approveRequest() throws Exception {
//        mockMvc.perform(post("/requests/approve/1"))
//                .andDo(print())
//                .andExpect(status().isOk());
//
//        log.info("\n\nRequests: " + requestRepository.findAll() + "\n\n");
//    }
//
//    @Test
//    @WithMockUser(value = "testlead@example.com", roles = {"LEAD"})
//    public void declineRequest() throws Exception {
//        mockMvc.perform(post("/requests/decline/1"))
//                .andDo(print())
//                .andExpect(status().isOk());
//
//        log.info("\n\nRequests: " + requestRepository.findAll() + "\n\n");
//    }
//
//    @Test
//    @WithMockUser("testuser2@example.com")
//    public void deleteRequest() throws Exception {
//        mockMvc.perform(get("/requests/delete/1"))
//                .andDo(print())
//                .andExpect(status().isOk());
//
//        log.info("\n\nRequests: " + requestRepository.findAll() + "\n\n");
//    }
//
//    @Test
//    @WithMockUser("testuser2@example.com")
//    public void updateRequest() throws Exception {
//        RequestDTO requestDTO = new RequestDTO();
//        requestDTO.setStartDate(LocalDate.now());
//        requestDTO.setFinishDate(LocalDate.now().plusDays(1));
//        requestDTO.setReason("Personal Leave");
//        requestDTO.setComment("integration test...");
//
//        String json = objectMapper.writeValueAsString(requestDTO);
//
//        mockMvc.perform(post("/requests/update/1")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(json))
//                .andDo(print())
//                .andExpect(status().isOk());
//
//        log.info("\n\nRequests: " + requestRepository.findAll() + "\n\n");
//    }
}
