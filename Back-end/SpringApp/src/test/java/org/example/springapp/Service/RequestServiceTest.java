package org.example.springapp.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.springapp.DTO.RequestDTO;
import org.example.springapp.DTO.UserDTO;
import org.example.springapp.Model.*;
import org.example.springapp.Repository.RequestRepository;
import org.example.springapp.util.CustomObjectMappers;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@ExtendWith(MockitoExtension.class)
@RequiredArgsConstructor
class RequestServiceTest {

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private CustomObjectMappers customObjectMappers;

    @InjectMocks
    private RequestService requestService;

    @Test
    void findByUser() {
        UserRole leadRole = new UserRole("ROLE_LEAD");
        UserRole ceoRole = new UserRole("ROLE_CEO");

        RequestStatus status = new RequestStatus("Pending");
        RequestReason reason = new RequestReason("Sick Leave");
        ApproverAction approverAction = new ApproverAction("Unchecked");
        User user1 = new User(1, "Hannah", "Thomas", "password008", "hannah.thomas@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                20, 2, ceoRole, "CEO");
        User user2 = new User(2, "Grace", "Anderson", "password007", "illia.kamarali.work@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face2.png?alt=media&token=00b3ff76-f272-4fde-a6ad-07f83088d115",
                20, 2, leadRole, "Project Manager");
        User user4 = new User(4, "Eve", "Davis", "password005", "kamarali2025mf12@student.karazin.ua", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        Request request1 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, user4, user1, status, reason, approverAction, "pls...");
        RequestDTO requestDTO1 = new RequestDTO(27, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 1, 4, "Illia Kamarali",
                "Pending", "Sick Leave", "Unchecked", "pls...");
        Request request2 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, user4, user2, status, reason, approverAction, "pls...");
        RequestDTO requestDTO2 = new RequestDTO(28, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 2, 4, "Illia Kamarali",
                "Pending", "Sick Leave", "Unchecked", "pls...");

        Mockito.when(requestRepository.findAllByUserId(4)).thenReturn(List.of(request1, request2));
        Mockito.when(customObjectMappers.requestToDto(request1)).thenReturn(requestDTO1);
        Mockito.when(customObjectMappers.requestToDto(request2)).thenReturn(requestDTO2);

        List<RequestDTO> gotten = requestService.findByUser(4);

        Assertions.assertEquals(gotten, List.of(requestDTO1, requestDTO2));
    }

    // combinedRequests
    @Test
    void combinedList() {
        UserRole leadRole = new UserRole("ROLE_LEAD");
        UserRole ceoRole = new UserRole("ROLE_CEO");

        RequestStatus pending = new RequestStatus("Pending");

        RequestReason sickLeave = new RequestReason("Sick Leave");

        ApproverAction unchecked = new ApproverAction("Unchecked");

        User expectedUser1 = new User(1, "Hannah", "Thomas", "password008", "hannah.thomas@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                20, 2, ceoRole, "CEO");
        UserDTO expectedDTO1 = new UserDTO(
                1, "Hannah", "Thomas", "hannah.thomas@gmail.com", "password008",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                "CEO", "ROLE_CEO");

        User expectedUser4 = new User(4, "Eve", "Davis", "password005", "kamarali2025mf12@student.karazin.ua", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        UserDTO expectedDTO4 = new UserDTO(
                4, "Eve", "Davis", "kamarali2025mf12@student.karazin.ua", "password005",
                "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                "Tech Lead", "ROLE_LEAD");

        Request request21 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, expectedUser4, expectedUser1, pending, sickLeave, unchecked, "pls...");
        request21.setId(27);
        Request request22 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, expectedUser4, expectedUser1, pending, sickLeave, unchecked, "pls...");
        request22.setId(28);

        RequestDTO requestDTO21 = new RequestDTO(27, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 1, 4, "Illia Kamarali",
                "Pending", "Sick Leave", "Unchecked", "pls...");
        RequestDTO requestDTO21Compare = new RequestDTO(27, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 1, 4, "Illia Kamarali",
                "Pending", "Sick Leave", null, "pls...");
        RequestDTO requestDTO22 = new RequestDTO(28, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 2, 4, "Illia Kamarali",
                "Pending", "Sick Leave", "Unchecked", "pls...");

        // Simulating all requests with same uniqueCode
        List<Request> requestsWithSameCode = List.of(request21, request22);
        List<RequestDTO> requestDTOsWithSameCode = List.of(requestDTO21, requestDTO22);

        // Mock repository and mapper calls
        Mockito.when(requestRepository.findAllByUserId(4)).thenReturn(requestsWithSameCode);
        Mockito.when(requestRepository.findAllByUniqueCode("UAjXIr1k")).thenReturn(requestsWithSameCode);
        Mockito.when(customObjectMappers.requestToDto(request21)).thenReturn(requestDTO21);
        Mockito.when(customObjectMappers.requestToDto(request22)).thenReturn(requestDTO22);

        List<RequestDTO> gotten = requestService.combinedList(4);
        Assertions.assertEquals(gotten, List.of(requestDTO21Compare));

    }

//    @Test
//    void addRequest() {
//
//    }
//
//    @Test
//    void approveRequest() {
//    }
//
//    @Test
//    void declineRequest() {
//    }
//
//    @Test
//    void generateRandomString() {
//    }
//
//    @Test
//    void getRequestById() {
//    }
//
//    @Test
//    void updateRequest() {
//    }
//
//    @Test
//    void deleteRequest() {
//    }
}