package org.example.springapp.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Security.AuthenticationRequest;
import org.example.springapp.Security.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthenticationControllerTest {

    @Mock
    private AuthenticationService service;

    @Mock
    private UserRepository repository;

    @InjectMocks
    private AuthenticationController controller;

    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void login() throws Exception {
        AuthenticationRequest request = new AuthenticationRequest("test@mail.com", "password");
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        Mockito.when(repository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());
    }
}