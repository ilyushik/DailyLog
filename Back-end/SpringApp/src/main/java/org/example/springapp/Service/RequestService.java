package org.example.springapp.Service;

import org.example.springapp.DTO.RequestDTO;
import org.example.springapp.Mail.MailService;
import org.example.springapp.Mail.MailStructure;
import org.example.springapp.Model.ApproverAction;
import org.example.springapp.Model.Request;
import org.example.springapp.Model.RequestStatus;
import org.example.springapp.Repository.ApproverActionRepository;
import org.example.springapp.Repository.RequestRepository;
import org.example.springapp.Repository.RequestStatusRepository;
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
    @Autowired
    private ApproverActionRepository approverActionRepository;
    @Autowired
    private RequestStatusRepository requestStatusRepository;
    @Autowired
    private MailService mailService;

    public List<RequestDTO> findByUser(int id) {
        return requestRepository.findAllByUserId(id).stream().map(s -> new RequestDTO(
                s.getId(),
                s.getStartDate(),
                s.getFinishDate(),
                s.getCreatedAt(),
                s.getUniqueCode(),
                s.getDateOfResult() != null ? s.getDateOfResult() : null,
                s.getApproverId().getId(),
                s.getUser().getId(),
                s.getUser().getFirstName() + " " + s.getUser().getSecondName(),
                s.getStatus().getStatus(),
                s.getReason().getReason(),
                s.getAction().getAction()
        )).collect(Collectors.toList());
    }

    public List<RequestDTO> findByApprover(int approverId) {
        return requestRepository.findAll().stream().map(s -> new RequestDTO(
                s.getId(),
                s.getStartDate(),
                s.getFinishDate(),
                s.getCreatedAt(),
                s.getUniqueCode(),
                s.getDateOfResult() != null ? s.getDateOfResult() : null,
                s.getApproverId().getId(),
                s.getUser().getId(),
                s.getUser().getFirstName() + " " + s.getUser().getSecondName(),
                s.getStatus().getStatus(),
                s.getReason().getReason(),
                s.getAction().getAction()
        )).filter(r->r.getApprover() == approverId && r.getStatus().equals("Pending") && r.getAction().equals("Unchecked")).collect(Collectors.toList());
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
        String userFullName = representativeRequest.getUser().getFirstName() + " " + representativeRequest.getUser().getSecondName();
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

        return new RequestDTO(id, startDate, finishDate, createdAt, unique_Code, null, approverId, user, userFullName, overallStatus, reason, null);
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

    public Request approveRequest(int id) {
        Request request = requestRepository.findById(id).orElse(null);
        String uniqueCode = request.getUniqueCode();
        List<Request> sameRequests = new ArrayList<>();

        ApproverAction action = approverActionRepository.findApproverActionByAction("Approve");
        RequestStatus status = requestStatusRepository.findByStatus("Approved");

        if (request == null) {
            return null;
        }


        request.setAction(action);

        for (Request r : requestRepository.findAll()) {
            if (r.getUniqueCode().equals(uniqueCode)) {
                sameRequests.add(r);
            }
        }

        boolean allApproved = sameRequests.stream()
                .allMatch(req -> req.getAction().equals(action));

        if (sameRequests.size() == 1) {
            request.setStatus(status);
            request.setDateOfResult(new Timestamp(System.currentTimeMillis()));

            MailStructure mailStructure = new MailStructure("Info about your request", "Your request was approved");
            mailService.sendMail(request.getUser().getEmail(), mailStructure);
        }

        if (sameRequests.size() == 3) {
            if (allApproved) {
                for(Request r : sameRequests) {
                    r.setStatus(status);
                    r.setDateOfResult(new Timestamp(System.currentTimeMillis()));
                }

                MailStructure mailStructure = new MailStructure("Info about your request", "Your request was approved");
                mailService.sendMail(request.getUser().getEmail(), mailStructure);
            }
        }


        return requestRepository.save(request);
    }

    public Request declineRequest(int id) {
        Request request = requestRepository.findById(id).orElse(null);
        String uniqueCode = request.getUniqueCode();
        ApproverAction action = approverActionRepository.findApproverActionByAction("Decline");
        RequestStatus status = requestStatusRepository.findByStatus("Declined");
        if (request == null) {
            return null;
        }

        request.setAction(action);

        for (Request r : requestRepository.findAll()) {
            if (r.getUniqueCode().equals(uniqueCode)) {
                r.setStatus(status);
                r.setDateOfResult(new Timestamp(System.currentTimeMillis()));
            }
        }

        MailStructure mailStructure = new MailStructure("Info about your request", "Your request was declined");
        mailService.sendMail(request.getUser().getEmail(), mailStructure);

        return requestRepository.save(request);
    }

}
