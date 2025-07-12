package org.example.springapp.Integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.springapp.Model.User;
import org.example.springapp.Model.UserRole;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Repository.UserRoleRepository;
import org.example.springapp.Security.AuthenticationRequest;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AuthControllerIntegrationTest {

//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private ObjectMapper mapper;
//
//    @Autowired
//    private UserRepository userRepository;
//    @Autowired
//    private UserRoleRepository userRoleRepository;
//
//    @BeforeAll
//    public void setup() {
//        UserRole userRole = new UserRole("ROLE_USER");
//        userRoleRepository.save(userRole);
//
//        User user = new User();
//        user.setFirstName("Illia");
//        user.setSecondName("Kamarali");
//        user.setPassword("12345678");
//        user.setEmail("test@example.com");
//        user.setDaysForVacation(20);
//        user.setDaysToSkip(3);
//        user.setRole(userRole);
//        userRepository.save(user);
//    }
//
//    @Test
//    @WithMockUser("test@example.com")
//    public void login() throws Exception {
//        AuthenticationRequest authenticationRequest =
//                new AuthenticationRequest("test@example.com", "12345678");
//
//        String json = mapper.writeValueAsString(authenticationRequest);
//        mockMvc.perform(post("/login")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(json))
//                .andDo(print())
//                .andExpect(status().isOk());
//    }
}
