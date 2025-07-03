package org.example.springapp.Service;

import org.example.springapp.DTO.RequestReasonDTO;
import org.example.springapp.Model.RequestReason;
import org.example.springapp.Repository.RequestReasonRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class RequestReasonServiceTest {

    @Mock
    private RequestReasonRepository requestReasonRepository;

    @InjectMocks
    private RequestReasonService requestReasonService;

    @Test
    void reasons() {
        RequestReason annualLeave = new RequestReason("Annual Leave");
        annualLeave.setId(1);
        RequestReason sickLeave = new RequestReason("Sick Leave");
        sickLeave.setId(2);
        RequestReason personalLeave = new RequestReason("Personal Leave");
        personalLeave.setId(3);
        RequestReason workFromHome = new RequestReason("Work from Home");
        workFromHome.setId(4);

        RequestReasonDTO annualLeaveDTO = new RequestReasonDTO(annualLeave.getId(),annualLeave.getReason());
        RequestReasonDTO sickLeaveDTO = new RequestReasonDTO(sickLeave.getId(), sickLeave.getReason());
        RequestReasonDTO personalLeaveDTO = new RequestReasonDTO(personalLeave.getId(), personalLeave.getReason());
        RequestReasonDTO workFromHomeDTO = new RequestReasonDTO(workFromHome.getId(), workFromHome.getReason());

        Mockito.when(requestReasonRepository.findAll()).thenReturn(List.of(annualLeave, sickLeave, personalLeave,
                workFromHome));


        List<RequestReasonDTO> gotten = requestReasonService.reasons();
        Assertions.assertEquals(gotten, List.of(annualLeaveDTO, sickLeaveDTO, personalLeaveDTO, workFromHomeDTO));
    }
}