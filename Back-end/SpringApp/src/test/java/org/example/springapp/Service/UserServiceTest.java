package org.example.springapp.Service;

import lombok.RequiredArgsConstructor;
import org.example.springapp.DTO.UserDTO;
import org.example.springapp.Model.User;
import org.example.springapp.Model.UserRole;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Repository.UserRoleRepository;
import org.example.springapp.util.CustomObjectMappers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
@RequiredArgsConstructor
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRoleRepository userRoleRepository;
    @Mock
    private CustomObjectMappers customObjectMappers;

    private final Logger logger = LoggerFactory.getLogger(UserServiceTest.class);

    // find by email
    @Test
    void userByEmail() {
        UserRole userRole = userRoleRepository.findUserRoleByRole("ROLE_USER");
        User expectedUser = new User(6, "Illia", "Kamarali", "password003", "kamaraliilya@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face6.png?alt=media&token=5de9c272-3373-4fe4-acee-fd6c57e336cc",
                15, 1, userRole, "Java Developer");
        UserDTO expectedDTO = new UserDTO(
                6, "Illia", "Kamarali", "kamaraliilya@gmail.com", "password003",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face6.png?alt=media&token=5de9c272-3373-4fe4-acee-fd6c57e336cc",
                "Java Developer", "ROLE_USER");

        Mockito.when(userRepository.findByEmail("kamaraliilya@gmail.com")).thenReturn(Optional.of(expectedUser));
        Mockito.when(customObjectMappers.userToDto(expectedUser)).thenReturn(expectedDTO);

        UserDTO gottenUserDTO = userService.userByEmail("kamaraliilya@gmail.com");
        Assertions.assertEquals(customObjectMappers.userToDto(expectedUser), gottenUserDTO);
    }

    @Test
    void users() {
        UserRole userRole = userRoleRepository.findUserRoleByRole("ROLE_USER");
        UserRole leadRole = userRoleRepository.findUserRoleByRole("ROLE_LEAD");
        UserRole ceoRole = userRoleRepository.findUserRoleByRole("ROLE_CEO");

        User expectedUser1 = new User(1, "Hannah", "Thomas", "password008", "hannah.thomas@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                20, 2, ceoRole, "CEO");
        UserDTO expectedDTO1 = new UserDTO(
                1, "Hannah", "Thomas", "hannah.thomas@gmail.com", "password008",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                "CEO", "ROLE_CEO");

        User expectedUser2 = new User(2, "Grace", "Anderson", "password007", "illia.kamarali.work@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face2.png?alt=media&token=00b3ff76-f272-4fde-a6ad-07f83088d115",
                20, 2, leadRole, "Project Manager");
        UserDTO expectedDTO2 = new UserDTO(
                2, "Grace", "Anderson", "illia.kamarali.work@gmail.com", "password007",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face2.png?alt=media&token=00b3ff76-f272-4fde-a6ad-07f83088d115",
                "Project Manager", "ROLE_LEAD");

        User expectedUser3 = new User(3, "Alice", "Johnson", "password001", "fastandfoodycorp@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face3.png?alt=media&token=68f1684a-d5cd-4698-9b86-fffbd734ea77",
                20, 2, leadRole, "Team Lead");
        UserDTO expectedDTO3 = new UserDTO(
                3, "Alice", "Johnson", "fastandfoodycorp@gmail.com", "password001",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face3.png?alt=media&token=68f1684a-d5cd-4698-9b86-fffbd734ea77",
                "Team Lead", "ROLE_LEAD");

        User expectedUser4 = new User(4, "Eve", "Davis", "password005", "kamarali2025mf12@student.karazin.ua", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        UserDTO expectedDTO4 = new UserDTO(
                4, "Eve", "Davis", "kamarali2025mf12@student.karazin.ua", "password005",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                "Tech Lead", "ROLE_LEAD");

        User expectedUser5 = new User(5, "Bob", "Smith", "password002", "bob.smith@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face5.png?alt=media&token=1491c5c7-7391-4a6b-9071-b95a883e7207",
                20, 2, userRole, "Developer");
        UserDTO expectedDTO5 = new UserDTO(
                5, "Bob", "Smith", "bob.smith@example.com", "password002",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face5.png?alt=media&token=1491c5c7-7391-4a6b-9071-b95a883e7207",
                "Developer", "ROLE_USER");

        User expectedUser6 = new User(6, "Illia", "Kamarali", "password003", "kamaraliilya@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face6.png?alt=media&token=5de9c272-3373-4fe4-acee-fd6c57e336cc",
                15, 1, userRole, "Java Developer");
        UserDTO expectedDTO6 = new UserDTO(
                6, "Illia", "Kamarali", "kamaraliilya@gmail.com", "password003",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face6.png?alt=media&token=5de9c272-3373-4fe4-acee-fd6c57e336cc",
                "Java Developer", "ROLE_USER");

        User expectedUser7 = new User(7, "Bohdan", "Khokhlov", "password004", "hohlovb123@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face7.png?alt=media&token=2ef56ec2-d4dc-4dbe-8614-aaadb1da3c70",
                20, 2, userRole, "Data Analyst");
        UserDTO expectedDTO7 = new UserDTO(
                7, "Bohdan", "Khokhlov", "hohlovb123@gmail.com", "password004",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face7.png?alt=media&token=2ef56ec2-d4dc-4dbe-8614-aaadb1da3c70",
                "Data Analyst", "ROLE_USER");

        User expectedUser8 = new User(8, "Frank", "Miller", "password006", "frank.miller@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face8.png?alt=media&token=518caa3b-a792-44ce-aa91-38a853895cbf",
                20, 2, userRole, "Developer");
        UserDTO expectedDTO8 = new UserDTO(
                8, "Frank", "Miller", "frank.miller@example.com", "password006",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face8.png?alt=media&token=518caa3b-a792-44ce-aa91-38a853895cbf",
                "Developer", "ROLE_USER");

        User expectedUser9 = new User(9, "Bob", "Marley", "password009", "bob.marley@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face2.png?alt=media&token=00b3ff76-f272-4fde-a6ad-07f83088d115",
                20, 2, leadRole, "Developer");
        UserDTO expectedDTO9 = new UserDTO(
                9, "Bob", "Marley", "bob.marley@example.com", "password009",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face2.png?alt=media&token=00b3ff76-f272-4fde-a6ad-07f83088d115",
                "Project Manager", "ROLE_LEAD");

        Mockito.when(userRepository.findAll()).thenReturn(List.of(expectedUser1, expectedUser2, expectedUser3, expectedUser4,
                expectedUser5, expectedUser6, expectedUser7, expectedUser8, expectedUser9));
        Mockito.when(customObjectMappers.userToDto(expectedUser1)).thenReturn(expectedDTO1);
        Mockito.when(customObjectMappers.userToDto(expectedUser2)).thenReturn(expectedDTO2);
        Mockito.when(customObjectMappers.userToDto(expectedUser3)).thenReturn(expectedDTO3);
        Mockito.when(customObjectMappers.userToDto(expectedUser4)).thenReturn(expectedDTO4);
        Mockito.when(customObjectMappers.userToDto(expectedUser5)).thenReturn(expectedDTO5);
        Mockito.when(customObjectMappers.userToDto(expectedUser6)).thenReturn(expectedDTO6);
        Mockito.when(customObjectMappers.userToDto(expectedUser7)).thenReturn(expectedDTO7);
        Mockito.when(customObjectMappers.userToDto(expectedUser8)).thenReturn(expectedDTO8);
        Mockito.when(customObjectMappers.userToDto(expectedUser9)).thenReturn(expectedDTO9);

        List<UserDTO> gottenList = userService.users();
        Assertions.assertEquals(gottenList, List.of(expectedDTO1, expectedDTO2, expectedDTO3, expectedDTO4, expectedDTO5,
                expectedDTO6, expectedDTO7, expectedDTO8, expectedDTO9));
    }

    // find by id
    @Test
    void userById() {
        UserRole userRole = userRoleRepository.findUserRoleByRole("ROLE_USER");
        User expectedUser = new User(6, "Illia", "Kamarali", "password003", "kamaraliilya@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face6.png?alt=media&token=5de9c272-3373-4fe4-acee-fd6c57e336cc",
                15, 1, userRole, "Java Developer");
        UserDTO expectedDTO = new UserDTO(
                6, "Illia", "Kamarali", "kamaraliilya@gmail.com", "password003",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face6.png?alt=media&token=5de9c272-3373-4fe4-acee-fd6c57e336cc",
                "Java Developer", "ROLE_USER");

        Mockito.when(userRepository.findById(6)).thenReturn(Optional.of(expectedUser));
        Mockito.when(customObjectMappers.userToDto(expectedUser)).thenReturn(expectedDTO);

        UserDTO gottenUserDTO = userService.userById(6);
        Assertions.assertEquals(expectedDTO, gottenUserDTO);
    }

    // find by username
    @Test
    void userByUsername() {
        UserRole userRole = userRoleRepository.findUserRoleByRole("ROLE_USER");
        User expectedUser = new User(6, "Illia", "Kamarali", "password003", "kamaraliilya@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face6.png?alt=media&token=5de9c272-3373-4fe4-acee-fd6c57e336cc",
                15, 1, userRole, "Java Developer");
        UserDTO expectedDTO = new UserDTO(
                6, "Illia", "Kamarali", "kamaraliilya@gmail.com", "password003",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face6.png?alt=media&token=5de9c272-3373-4fe4-acee-fd6c57e336cc",
                "Java Developer", "ROLE_USER");
        Mockito.when(userRepository.findUserByFirstNameAndSecondName("Illia", "Kamarali")).thenReturn(expectedUser);
        Mockito.when(customObjectMappers.userToDto(expectedUser)).thenReturn(expectedDTO);

        UserDTO gottenUserDTO = userService.userByUsername("Illia Kamarali");
        Assertions.assertEquals(expectedDTO, gottenUserDTO);
    }

    // users by lead
    @Test
    void usersByLead() {
        UserRole userRole = new UserRole("ROLE_USER");
        UserRole leadRole = new UserRole("ROLE_LEAD");
        UserRole ceoRole = new UserRole("ROLE_CEO");

        User expectedUser1 = new User(1, "Hannah", "Thomas", "password008", "hannah.thomas@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                20, 2, ceoRole, "CEO");

        User expectedUser2 = new User(2, "Grace", "Anderson", "password007", "illia.kamarali.work@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face2.png?alt=media&token=00b3ff76-f272-4fde-a6ad-07f83088d115",
                20, 2, leadRole, "Project Manager");

        User expectedUser3 = new User(3, "Alice", "Johnson", "password001", "fastandfoodycorp@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face3.png?alt=media&token=68f1684a-d5cd-4698-9b86-fffbd734ea77",
                20, 2, leadRole, "Team Lead");

        User expectedUser4 = new User(4, "Eve", "Davis", "password005", "kamarali2025mf12@student.karazin.ua", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");

        User expectedUser5 = new User(5, "Bob", "Smith", "password002", "bob.smith@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face5.png?alt=media&token=1491c5c7-7391-4a6b-9071-b95a883e7207",
                20, 2, userRole, "Developer");
        UserDTO expectedDTO5 = new UserDTO(
                5, "Bob", "Smith", "bob.smith@example.com", "password002",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face5.png?alt=media&token=1491c5c7-7391-4a6b-9071-b95a883e7207",
                "Developer", "ROLE_USER");

        User expectedUser6 = new User(6, "Illia", "Kamarali", "password003", "kamaraliilya@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face6.png?alt=media&token=5de9c272-3373-4fe4-acee-fd6c57e336cc",
                15, 1, userRole, "Java Developer");

        User expectedUser7 = new User(7, "Bohdan", "Khokhlov", "password004", "hohlovb123@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face7.png?alt=media&token=2ef56ec2-d4dc-4dbe-8614-aaadb1da3c70",
                20, 2, userRole, "Data Analyst");
        UserDTO expectedDTO7 = new UserDTO(
                7, "Bohdan", "Khokhlov", "hohlovb123@gmail.com", "password004",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face7.png?alt=media&token=2ef56ec2-d4dc-4dbe-8614-aaadb1da3c70",
                "Data Analyst", "ROLE_USER");

        User expectedUser8 = new User(8, "Frank", "Miller", "password006", "frank.miller@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face8.png?alt=media&token=518caa3b-a792-44ce-aa91-38a853895cbf",
                20, 2, userRole, "Developer");
        UserDTO expectedDTO8 = new UserDTO(
                8, "Frank", "Miller", "frank.miller@example.com", "password006",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face8.png?alt=media&token=518caa3b-a792-44ce-aa91-38a853895cbf",
                "Developer", "ROLE_USER");

        User expectedUser9 = new User(9, "Bob", "Marley", "password009", "bob.marley@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face2.png?alt=media&token=00b3ff76-f272-4fde-a6ad-07f83088d115",
                20, 2, leadRole, "Developer");

        expectedUser5.setPm(expectedUser9);
        expectedUser7.setPm(expectedUser9);
        expectedUser8.setPm(expectedUser9);

        Mockito.when(userRepository.findById(9)).thenReturn(Optional.of(expectedUser9));
        Mockito.when(userRepository.findAll()).thenReturn(List.of(expectedUser1, expectedUser2, expectedUser3, expectedUser4,
                expectedUser5, expectedUser6, expectedUser7, expectedUser8, expectedUser9));
        Mockito.when(customObjectMappers.userToDto(expectedUser5)).thenReturn(expectedDTO5);
        Mockito.when(customObjectMappers.userToDto(expectedUser7)).thenReturn(expectedDTO7);
        Mockito.when(customObjectMappers.userToDto(expectedUser8)).thenReturn(expectedDTO8);

        List<UserDTO> gottenUsers = userService.usersByLead(9);
        Assertions.assertEquals(gottenUsers, List.of(expectedDTO5, expectedDTO7, expectedDTO8));
    }
}