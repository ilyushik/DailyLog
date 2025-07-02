package org.example.springapp.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.springapp.DTO.*;
import org.example.springapp.Model.*;
import org.example.springapp.Repository.*;
import org.example.springapp.util.CustomObjectMappers;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@Slf4j
@ExtendWith(MockitoExtension.class)
@RequiredArgsConstructor
class RequestServiceTest {

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private RequestStatusRepository requestStatusRepository;

    @Mock
    private RequestReasonRepository requestReasonRepository;

    @Mock
    private ApproverActionRepository approverActionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomObjectMappers customObjectMappers;

    @InjectMocks
    private RequestService requestService;

    @Spy
    @InjectMocks
    private RequestService requestServiceSpy;

    @Spy
    private CustomObjectMappers objectMappers;

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
                null, user1, user4, status, reason, approverAction, "pls...");
        RequestDTO requestDTO1 = new RequestDTO(27, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 1, 4, "Illia Kamarali",
                "Pending", "Sick Leave", "Unchecked", "pls...");
        Request request2 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, user2, user4, status, reason, approverAction, "pls...");
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
                null, expectedUser1, expectedUser4, pending, sickLeave, unchecked, "pls...");
        request21.setId(27);
        Request request22 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, expectedUser1, expectedUser4, pending, sickLeave, unchecked, "pls...");
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

    @Test
    void addRequest() {
        UserRole leadRole = new UserRole("ROLE_LEAD");
        int userId = 4;
        User pm = new User(2, "Grace", "Anderson", "password007", "illia.kamarali.work@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face2.png?alt=media&token=00b3ff76-f272-4fde-a6ad-07f83088d115",
                20, 2, leadRole, "Project Manager");

        User teamLead = new User(3, "Alice", "Johnson", "password001", "fastandfoodycorp@gmail.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face3.png?alt=media&token=68f1684a-d5cd-4698-9b86-fffbd734ea77",
                20, 2, leadRole, "Team Lead");
        User user = new User(4, "Eve", "Davis", "password005", "kamarali2025mf12@student.karazin.ua", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        RequestStatus status = new RequestStatus("Pending");
        RequestReason reason = new RequestReason("Sick Leave");
        ApproverAction action = new ApproverAction("Unchecked");

        RequestDTO requestDTO = new RequestDTO();
        requestDTO.setStartDate(LocalDate.of(2025, 7, 5));
        requestDTO.setFinishDate(LocalDate.of(2025, 7, 7));
        requestDTO.setReason("Sick Leave");
        requestDTO.setComment("Family issue");

        user.setPm(pm);
        user.setTeamLead(teamLead);

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        Mockito.when(requestStatusRepository.findByStatus("Pending")).thenReturn(status);
        Mockito.when(requestReasonRepository.findByReason("Sick Leave")).thenReturn(reason);
        Mockito.when(approverActionRepository.findApproverActionByAction("Unchecked")).thenReturn(action);

        Mockito.doNothing().when(requestServiceSpy).createRequestAndAddApprover(any(User.class), any(User.class),
                anyString(), any(), any(), any(), any(RequestDTO.class));

        AddRequestReturnDTO result = requestServiceSpy.addRequest(userId, requestDTO);

        Assertions.assertEquals("kamarali2025mf12@student.karazin.ua", result.getUserEmail());
        Assertions.assertEquals("fastandfoodycorp@gmail.com", result.getFirstApproverEmail());
        Assertions.assertEquals("illia.kamarali.work@gmail.com", result.getThirdApproverEmail());
    }

    @Test
    void getRequestById() {
        int requestId = 1;

        UserRole leadRole = new UserRole("ROLE_LEAD");
        UserRole ceoRole = new UserRole("ROLE_CEO");
        RequestStatus status = new RequestStatus("Pending");
        RequestReason reason = new RequestReason("Sick Leave");
        ApproverAction approverAction = new ApproverAction("Unchecked");
        User user4 = new User(4, "Eve", "Davis", "password005", "kamarali2025mf12@student.karazin.ua", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        User user1 = new User(1, "Hannah", "Thomas", "password008", "hannah.thomas@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                20, 2, ceoRole, "CEO");

        Request request1 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, user1, user4, status, reason, approverAction, "pls...");
        RequestDTO requestDTO1 = new RequestDTO(27, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 1, 4, "Illia Kamarali",
                "Pending", "Sick Leave", "Unchecked", "pls...");
        request1.setId(requestId);
        requestDTO1.setId(requestId);

        Mockito.when(requestRepository.findById(requestId)).thenReturn(Optional.of(request1));
        Mockito.when(customObjectMappers.requestToDto(request1)).thenReturn(requestDTO1);

        Assertions.assertEquals(requestService.getRequestById(requestId), requestDTO1);
        Mockito.verify(requestRepository, Mockito.times(1)).findById(requestId);
    }

    @Test
    void approveRequest() {
        int requestId = 1;

        UserRole leadRole = new UserRole("ROLE_LEAD");
        UserRole ceoRole = new UserRole("ROLE_CEO");
        RequestStatus status = new RequestStatus("Pending");
        RequestStatus statusApproved = new RequestStatus("Approved");
        RequestReason reason = new RequestReason("Sick Leave");
        ApproverAction approverAction = new ApproverAction("Unchecked");
        ApproverAction approverActionApproved = new ApproverAction("Approve");
        User user4 = new User(4, "Eve", "Davis", "password005", "kamarali2025mf12@student.karazin.ua", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        User user1 = new User(1, "Hannah", "Thomas", "password008", "hannah.thomas@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                20, 2, ceoRole, "CEO");
        Request request1 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, user1, user4, status, reason, approverAction, "pls...");
        RequestDTO requestDTO1 = new RequestDTO(27, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 1, 4, "Illia Kamarali",
                "Pending", "Sick Leave", "Unchecked", "pls...");
        request1.setId(requestId);
        requestDTO1.setId(requestId);

        Report report = new Report(LocalDate.of(2025, 4, 28), "pls...", user4, request1);
        report.setStatus("leave");
        ReportDTO reportDTO = objectMappers.reportToDto(report);

        Mockito.when(approverActionRepository.findApproverActionByAction("Approve")).thenReturn(approverActionApproved);
        Mockito.when(requestStatusRepository.findByStatus("Approved")).thenReturn(statusApproved);
        Mockito.when(requestRepository.findAll()).thenReturn(List.of(request1));
        Mockito.when(requestRepository.findById(requestId)).thenReturn(Optional.of(request1));
        Mockito.when(customObjectMappers.reportToDto(report)).thenReturn(reportDTO);
        Mockito.when(reportRepository.save(Mockito.any(Report.class))).thenReturn(report);
        ValueOperations<String, Object> valueOperations = Mockito.mock(ValueOperations.class);
        Mockito.when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        CheckRequestDTO result = requestServiceSpy.approveRequest(requestId);
        Assertions.assertEquals(result.getUserEmail(), user4.getEmail());
        Assertions.assertEquals(result.getRequestStatus(), statusApproved.getStatus());
    }

    @Test
    void declineRequest() {
        int requestId = 1;

        UserRole leadRole = new UserRole("ROLE_LEAD");
        UserRole ceoRole = new UserRole("ROLE_CEO");
        RequestStatus status = new RequestStatus("Pending");
        RequestStatus statusDeclined = new RequestStatus("Declined");
        RequestReason reason = new RequestReason("Sick Leave");
        ApproverAction approverAction = new ApproverAction("Unchecked");
        ApproverAction approverActionDecline = new ApproverAction("Decline");
        User user4 = new User(4, "Eve", "Davis", "password005", "kamarali2025mf12@student.karazin.ua", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        User user1 = new User(1, "Hannah", "Thomas", "password008", "hannah.thomas@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                20, 2, ceoRole, "CEO");
        Request request1 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, user1, user4, status, reason, approverAction, "pls...");
        RequestDTO requestDTO1 = new RequestDTO(27, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 1, 4, "Illia Kamarali",
                "Pending", "Sick Leave", "Unchecked", "pls...");
        request1.setId(requestId);
        requestDTO1.setId(requestId);

        Mockito.when(approverActionRepository.findApproverActionByAction("Decline")).thenReturn(approverActionDecline);
        Mockito.when(requestStatusRepository.findByStatus("Declined")).thenReturn(statusDeclined);
        Mockito.when(requestRepository.findAll()).thenReturn(List.of(request1));
        Mockito.when(requestRepository.findById(requestId)).thenReturn(Optional.of(request1));

        CheckRequestDTO result = requestServiceSpy.declineRequest(requestDTO1);
        Assertions.assertEquals(result.getUserEmail(), user4.getEmail());
        Assertions.assertEquals(result.getRequestStatus(), statusDeclined.getStatus());
    }

    @Test
    void updateRequest() {
        int requestId = 1;
        UserRole leadRole = new UserRole("ROLE_LEAD");
        UserRole ceoRole = new UserRole("ROLE_CEO");
        RequestStatus status = new RequestStatus("Pending");
        RequestReason reason = new RequestReason("Sick Leave");
        RequestReason reasonP = new RequestReason("Personal Leave");
        ApproverAction approverAction = new ApproverAction("Unchecked");
        User user4 = new User(4, "Eve", "Davis", "password005", "kamarali2025mf12@student.karazin.ua", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        User user1 = new User(1, "Hannah", "Thomas", "password008", "hannah.thomas@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                20, 2, ceoRole, "CEO");

        Request request1 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, user1, user4, status, reason, approverAction, "pls...");
        Request requestUpdated = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, user1, user4, status, reasonP, approverAction, "pls...");
        RequestDTO requestDTO1 = new RequestDTO(27, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 1, 4, "Illia Kamarali",
                "Pending", "Sick Leave", "Unchecked", "pls...");
        request1.setId(requestId);
        requestDTO1.setId(requestId);

        Mockito.when(requestRepository.findById(requestId)).thenReturn(Optional.of(request1));
        Mockito.when(requestRepository.findAll()).thenReturn(List.of(request1));
        Mockito.when(requestRepository.save(Mockito.any(Request.class))).thenReturn(requestUpdated);
        Mockito.when(redisTemplate.delete(Mockito.anyString())).thenReturn(true);
        ValueOperations<String, Object> valueOperations = Mockito.mock(ValueOperations.class);
        Mockito.when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        request1.setReason(reasonP);

        Request gotten = requestServiceSpy.updateRequest(requestId, requestDTO1);
        Assertions.assertEquals(gotten, request1);

    }

    @Test
    void deleteRequest() {
        int requestId = 1;
        UserRole leadRole = new UserRole("ROLE_LEAD");
        UserRole ceoRole = new UserRole("ROLE_CEO");
        RequestStatus status = new RequestStatus("Pending");
        RequestReason reason = new RequestReason("Sick Leave");
        RequestReason reasonP = new RequestReason("Personal Leave");
        ApproverAction approverAction = new ApproverAction("Unchecked");
        User user4 = new User(4, "Eve", "Davis", "password005", "kamarali2025mf12@student.karazin.ua", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12",
                20, 2, leadRole, "Tech Lead");
        User user1 = new User(1, "Hannah", "Thomas", "password008", "hannah.thomas@example.com", "https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a",
                20, 2, ceoRole, "CEO");

        Request request1 = new Request(LocalDate.of(2025, 4, 28), LocalDate.of(2025, 4, 28),
                Timestamp.valueOf("2025-04-27 18:15:50"), "UAjXIr1k",
                null, user1, user4, status, reason, approverAction, "pls...");
        RequestDTO requestDTO1 = new RequestDTO(27, LocalDate.of(2025, 4, 28),
                LocalDate.of(2025, 4, 28), Timestamp.valueOf("2025-04-27 18:15:50"),
                "UAjXIr1k", null, 1, 4, "Illia Kamarali",
                "Pending", "Sick Leave", "Unchecked", "pls...");
        request1.setId(requestId);
        requestDTO1.setId(requestId);

        Report report = new Report(LocalDate.of(2025, 4, 28), "pls...", user4, request1);
        report.setStatus("leave");
        ReportDTO reportDTO = objectMappers.reportToDto(report);

        Mockito.when(requestRepository.findById(requestId)).thenReturn(Optional.of(request1));
        Mockito.when(reportRepository.findAll()).thenReturn(List.of(report));

        String gotten = requestServiceSpy.deleteRequest(requestId, 4);

        Assertions.assertEquals(gotten, "Request deleted");
    }
}