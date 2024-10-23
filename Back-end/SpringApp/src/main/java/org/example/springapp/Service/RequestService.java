package org.example.springapp.Service;

import org.example.springapp.DTO.RequestDTO;
import org.example.springapp.Model.Request;
import org.example.springapp.Model.RequestReason;
import org.example.springapp.Repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;

    public List<RequestDTO> findByUser(int id) {
        return requestRepository.findAllByUserId(id).stream().map(s-> new RequestDTO(
            s.getId(), s.getStartDate(), s.getFinishDate(), s.getCreatedAt(), s.getUniqueCode(),
                s.getDateOfResult(), s.getApproverId().getId(), s.getUser().getId(), s.getStatus().getStatus(),
                s.getReason().getReason(), s.getAction().getAction()
        )).collect(Collectors.toList());
    }

    public RequestDTO determineOverallStatus(String uniqueCode) {
        List<Request> requests = requestRepository.findAllByUniqueCode(uniqueCode);

        // Выбираем первый запрос как представителя для заполнения данных
        Request representativeRequest = requests.get(0);
        int id = representativeRequest.getId();
        LocalDate startDate = representativeRequest.getStartDate();
        LocalDate finishDate = representativeRequest.getFinishDate();
        Timestamp createdAt = representativeRequest.getCreatedAt();
        String unique_Code = representativeRequest.getUniqueCode();
        int user = representativeRequest.getUser().getId();
        String reason = representativeRequest.getReason().getReason();
        int approverId = representativeRequest.getApproverId().getId();

        // Определяем общий статус для запросов с этим uniqueCode
        boolean allApproved = requests.stream()
                .allMatch(request -> request.getAction().getAction().equals("Approve"));

        boolean anyRejected = requests.stream()
                .anyMatch(request -> request.getAction().getAction().equals("Decline"));

        String overallStatus;
        if (allApproved) {
            overallStatus = "Approved";
        } else if (anyRejected) {
            overallStatus = "Declined";
        } else {
            overallStatus = "Pending";
        }

        return new RequestDTO(id, startDate, finishDate, createdAt, unique_Code, null, approverId, user, overallStatus, reason, null);
    }

    public List<RequestDTO> combinedList(int userId) {
        List<RequestDTO> requests = findByUser(userId);
        List<RequestDTO> sortedList = new ArrayList<>();
        HashSet<Object> processedCodes = new HashSet<>();

        for (RequestDTO request : requests) {
            String uniqueCode = request.getUniqueCode();

            // Проверяем, был ли уже обработан этот uniqueCode
            if (!processedCodes.contains(uniqueCode)) {
                sortedList.add(determineOverallStatus(uniqueCode));
                processedCodes.add(uniqueCode);
            }
        }

        return sortedList;
    }


}
