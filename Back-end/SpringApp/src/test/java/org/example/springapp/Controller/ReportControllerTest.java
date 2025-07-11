package org.example.springapp.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.example.springapp.DTO.ReportDTO;
import org.example.springapp.DTO.UserDTO;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.ReportRepository;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Service.ReportService;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ReportControllerTest {

    @InjectMocks
    private ReportController controller;

    @Mock
    private ReportService service;

    @Mock
    private UserRepository repository;

    @Mock
    private ReportRepository repository2;

    @Mock
    private UserService userService;

    private MockMvc mockMvc;

    private ObjectMapper mapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
    }

    @Test
    void getReport() throws Exception {
        String email = "test@mail.com";
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getName()).thenReturn(email);

        SecurityContext context = Mockito.mock(SecurityContext.class);
        Mockito.when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        UserDTO user =  new UserDTO();
        user.setId(1);

        ReportDTO reportDTO1 = new ReportDTO();
        reportDTO1.setUser(1);
        ReportDTO reportDTO2 = new ReportDTO();
        reportDTO2.setUser(1);
        ReportDTO reportDTO3 = new ReportDTO();
        reportDTO3.setUser(2);

        Mockito.when(userService.userByEmail(email)).thenReturn(user);
        Mockito.when(service.getReportsByUserId(user.getId())).thenReturn(List.of(reportDTO1,reportDTO2));

        List<ReportDTO> reports = List.of(reportDTO1, reportDTO2, reportDTO3);

        mockMvc.perform(get("/report/usersReports"))
                .andExpect(status().isOk());
    }

    @Test
    void getReportByUser() throws  Exception {
        UserDTO user =  new UserDTO();
        user.setId(1);

        ReportDTO reportDTO1 = new ReportDTO();
        reportDTO1.setUser(1);
        ReportDTO reportDTO2 = new ReportDTO();
        reportDTO2.setUser(1);
        ReportDTO reportDTO3 = new ReportDTO();
        reportDTO3.setUser(2);

        Mockito.when(service.getReportsByUserId(user.getId())).thenReturn(List.of(reportDTO1,reportDTO2));

        mockMvc.perform(get("/report/usersReports/" + user.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void addReport() throws Exception {
        String email = "test@example.com";

        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getName()).thenReturn(email);
        SecurityContext context = Mockito.mock(SecurityContext.class);
        Mockito.when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        User user =  new User();

        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setDate(LocalDate.of(2025, 1,3));
        reportDTO.setCountOfHours(7);

        ReportDTO reportDTO1 = new ReportDTO();
        reportDTO1.setDate(LocalDate.of(2025, 1, 1));
        ReportDTO reportDTO2 = new ReportDTO();
        reportDTO2.setDate(LocalDate.of(2025, 1, 2));
        reportDTO2.setRequest(1);

        Mockito.when(repository.findByEmail(email)).thenReturn(Optional.of(user));
        Mockito.when(service.getReportsByUserId(user.getId()).stream().filter(s->s.getDate()
                .equals(reportDTO.getDate()) && s.getRequest() == null).toList()).thenReturn(List.of(reportDTO1));
        Mockito.when(service.getReportsByUserId(user.getId()).stream().filter(s->s.getDate().
                equals(reportDTO.getDate()) && s.getRequest() != null).toList()).thenReturn(List.of(reportDTO2));

        String json = mapper.writeValueAsString(reportDTO);

        mockMvc.perform(post("/report/add-report")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());
    }
//
//    @Test
//    void downloadReportExcel() {
//    }
//
//    @Test
//    void testDownloadReportExcel() {
//    }
//
//    @Test
//    void updateReport() {
//    }
//
//    @Test
//    void deleteReport() {
//    }
}