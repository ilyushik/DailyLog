package org.example.springapp.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.example.springapp.DTO.ReportDTO;
import org.example.springapp.DTO.RequestDTO;
import org.example.springapp.DTO.UserDTO;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Service.ReportService;
import org.example.springapp.Service.RequestService;
import org.example.springapp.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReportService reportService;

    @Mock
    private RequestService requestService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void getMyInfo() throws Exception {
        String email = "test@example.com";
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getName()).thenReturn(email);

        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        UserDTO user = new UserDTO();
        user.setEmail(email);
        Mockito.when(userService.userByEmail(email)).thenReturn(user);

        mockMvc.perform(get("/getMyInfo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    void users() throws Exception {
        String email = "test@mail.com";

        UserDTO user1 = new UserDTO();
        user1.setFirstName("Illia");
        user1.setEmail(email);
        UserDTO user2 = new UserDTO();
        user2.setFirstName("Ravshan");
        user2.setEmail(email);
        Mockito.when(userService.users()).thenReturn(List.of(user1, user2));

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk());
    }

    @Test
    void getUserByName() throws Exception {
        String username = "Illia Kamarali";
        UserDTO user = new UserDTO();
        user.setFirstName("Illia");
        user.setSecondName("Kamarali");

        Mockito.when(userService.userByUsername(username)).thenReturn(user);
        mockMvc.perform(get("/users/username?username=" + username))
                .andExpect(status().isOk());
    }

    @Test
    void userById() throws Exception {
        int id = 1;
        UserDTO user = new UserDTO();
        user.setFirstName("Illia");
        user.setSecondName("Kamarali");
        user.setId(id);

        Mockito.when(userService.userById(id)).thenReturn(user);

        mockMvc.perform(get("/users/" + id))
                .andExpect(status().isOk());
    }

    @Test
    void addRequest() throws Exception {
        String email = "test@example.com";
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getName()).thenReturn(email);

        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        User user = new User();
        user.setDaysForVacation(20);
        user.setDaysToSkip(3);
        user.setId(1);

        UserDTO user1 = new UserDTO();
        user1.setEmail(email);
        user1.setId(1);
        UserDTO user2 = new UserDTO();
        user2.setEmail("dhssghdjsadfgahsj");
        user2.setId(2);

        ReportDTO reportDTO1 = new ReportDTO();
        reportDTO1.setId(1);
        reportDTO1.setUser(1);
        reportDTO1.setDate(LocalDate.of(2025, 4, 5));
        ReportDTO reportDTO2 = new ReportDTO();
        reportDTO2.setId(2);
        reportDTO2.setUser(2);
        reportDTO2.setDate(LocalDate.of(2025, 4, 6));
        ReportDTO reportDTO3 = new ReportDTO();
        reportDTO3.setId(3);
        reportDTO3.setUser(1);
        reportDTO3.setDate(LocalDate.of(2025, 4, 7));

        RequestDTO requestDTO1 = new RequestDTO();
        requestDTO1.setId(1);
        requestDTO1.setUser(1);
        requestDTO1.setStatus("Approved");
        requestDTO1.setStartDate(LocalDate.of(2025, 6, 5));
        requestDTO1.setFinishDate(LocalDate.of(2025, 6, 7));
        RequestDTO requestDTO2 = new RequestDTO();
        requestDTO2.setId(2);
        requestDTO2.setUser(2);
        requestDTO2.setStatus("Pending");
        requestDTO2.setStartDate(LocalDate.of(2025, 7, 1));
        requestDTO2.setFinishDate(LocalDate.of(2025, 7, 1));
        RequestDTO requestDTO3 = new RequestDTO();
        requestDTO3.setId(3);
        requestDTO3.setUser(1);
        requestDTO3.setStatus("Approved");
        requestDTO3.setStartDate(LocalDate.of(2025, 5, 5));
        requestDTO3.setFinishDate(LocalDate.of(2025, 6, 7));

        RequestDTO requestDTO = new RequestDTO();
        requestDTO.setStartDate(LocalDate.now());
        requestDTO.setFinishDate(LocalDate.now());
        requestDTO.setReason("Sick Leave");
        requestDTO.setComment("Family issue");

        Mockito.when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        Mockito.when(reportService.getReportsByUserId(user.getId())).thenReturn(List.of(reportDTO1, reportDTO3));
        Mockito.when(requestService.findByUser(user.getId())).thenReturn(List.of(requestDTO1, requestDTO2));

        String json = objectMapper.writeValueAsString(requestDTO);

        mockMvc.perform(post("/addRequest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void peopleList() throws Exception {
        String email = "test@example.com";
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getName()).thenReturn(email);

        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        UserDTO user1 = new UserDTO();
        user1.setEmail("dfsfdsfdf");
        user1.setId(1);
        UserDTO user2 = new UserDTO();
        user2.setEmail("asdsadsad");
        user2.setId(2);
        User lead = new User();
        lead.setEmail(email);
        lead.setId(3);

        Mockito.when(userRepository.findByEmail(email)).thenReturn(Optional.of(lead));
        Mockito.when(userService.usersByLead(lead.getId())).thenReturn(List.of(user1, user2));

        mockMvc.perform(get("/peopleList"))
                .andExpect(status().isOk());
    }
}