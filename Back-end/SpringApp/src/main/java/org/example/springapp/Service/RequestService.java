package org.example.springapp.Service;

import org.example.springapp.DTO.AddRequestReturnDTO;
import org.example.springapp.DTO.CheckRequestDTO;
import org.example.springapp.DTO.RequestDTO;
import org.example.springapp.Model.*;
import org.example.springapp.Repository.*;
import org.example.springapp.util.CustomObjectMappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
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
    private UserRepository userRepository;
    @Autowired
    private RequestReasonRepository requestReasonRepository;
    @Autowired
    private ReportRepository reportRepository;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    private CustomObjectMappers customObjectMappers;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;


    @Cacheable(value = "allUserRequests", key = "'userId=' + #id")
    public List<RequestDTO> findByUser(int id) {
        return requestRepository
                .findAllByUserId(id)
                .stream()
                .map(s -> customObjectMappers.requestToDto(s))
                .toList();
    }

    public List<RequestDTO> findByApprover(int approverId) {
        List<RequestDTO> list = new ArrayList<>(requestRepository
                .findAll()
                .stream()
                .map(s -> customObjectMappers.requestToDto(s))
                .filter(r -> r.getApprover() == approverId &&
                        r.getStatus().equals("Pending") && r.getAction().equals("Unchecked"))
                .toList());

        Collections.reverse(list);
        return list;
    }

    @Cacheable(value = "requestsByUniqueCode", key = "'uniqueCode=' + #uniqueCode")
    public List<RequestDTO> requestsByUniqueCode(String uniqueCode) {
        return requestRepository
                .findAllByUniqueCode(uniqueCode)
                .stream()
                .map(r -> customObjectMappers.requestToDto(r))
                .toList();
    }


    private RequestDTO determineOverallStatus(String uniqueCode) {
        List<RequestDTO> requests = requestsByUniqueCode(uniqueCode);

        // Выбираем первый запрос как представителя для заполнения данных
        RequestDTO representativeRequest = requests.get(0);
        int id = representativeRequest.getId();
        LocalDate startDate = representativeRequest.getStartDate();
        LocalDate finishDate = representativeRequest.getFinishDate();
        Timestamp createdAt = representativeRequest.getCreatedAt();
        String unique_Code = representativeRequest.getUniqueCode();
        int user = representativeRequest.getUser();
        String userFullName = representativeRequest.getFullUserName();
        String reason = representativeRequest.getReason();
        int approverId = representativeRequest.getApprover();
        String comment = representativeRequest.getComment();

        // Определяем общий статус для запросов с этим uniqueCode
        boolean allApproved = requests.stream()
                .allMatch(request -> request.getAction().equals("Approve"));

        boolean anyRejected = requests.stream()
                .anyMatch(request -> request.getAction().equals("Decline"));

        String overallStatus;
        if (allApproved) {
            overallStatus = "Approved";
        } else if (anyRejected) {
            overallStatus = "Declined";
        } else {
            overallStatus = "Pending";
        }

        return new RequestDTO(id, startDate, finishDate, createdAt, unique_Code, null, approverId, user, userFullName,
                overallStatus, reason, null, comment);
    }

    @Cacheable(value = "combinedUserRequests", key = "'userId=' + #userId")
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

        Collections.reverse(sortedList);

        return sortedList;
    }

    public CheckRequestDTO approveRequest(int id) {
        CheckRequestDTO checkRequestDTO = new CheckRequestDTO();
        Request request = requestRepository.findById(id).orElse(null);
        String uniqueCode = request.getUniqueCode();
        List<Request> sameRequests = new ArrayList<>();
        User user = request.getUser();
        List<LocalDate> dates = new ArrayList<>();
        LocalDate startDate = request.getStartDate();
        LocalDate finishDate = request.getFinishDate();
        LocalDate currentDate = startDate;

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

        if (!sameRequests.isEmpty()) {
            if (sameRequests.size() == 1 || allApproved) {
                sameRequests.forEach(r -> {
                    r.setStatus(status);
                    r.setDateOfResult(new Timestamp(System.currentTimeMillis()));
                });
            }
        }

        checkRequestDTO.setUserEmail(user.getEmail());


        if (request.getStatus().getStatus().equals("Approved")) {
            if (request.getReason().getReason().equals("Annual Leave")) {
                user.setDaysForVacation(user.getDaysForVacation() - (int)ChronoUnit.DAYS.between(request.getStartDate(),
                        request.getFinishDate()) - 1);
            }
            if (request.getReason().getReason().equals("Personal Leave")) {
                user.setDaysToSkip(user.getDaysToSkip() - (int)ChronoUnit.DAYS.between(request.getStartDate(),
                        request.getFinishDate()) - 1);
            }
            if (request.getReason().getReason().equals("Sick Leave")) {
                user.setDaysToSkip(user.getDaysToSkip() - (int)ChronoUnit.DAYS.between(request.getStartDate(),
                        request.getFinishDate()) - 1);
            }

            userRepository.save(user);
            checkRequestDTO.setRequestStatus("Approved");


            // maybe remove work from home
            if (request.getReason().getReason().equals("Work from Home")) {
                requestRepository.save(request);
                return checkRequestDTO;
            }

            while (!currentDate.isAfter(finishDate)) {
                dates.add(currentDate);
                currentDate = currentDate.plusDays(1);
            }

            for (LocalDate l : dates) {
                Report report = new Report(l, request.getComment(), user, request);
                report.setStatus("leave");
                Report report1 = reportRepository.save(report);
                redisTemplate.opsForValue().set("report::reportId" + report1.getId(), customObjectMappers.reportToDto(report1));
            }

            return checkRequestDTO;
        }

        requestRepository.save(request);
        checkRequestDTO.setRequestStatus("Pending");
        return checkRequestDTO;
    }


    public CheckRequestDTO declineRequest(int id) {
        CheckRequestDTO checkRequestDTO = new CheckRequestDTO();
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
        requestRepository.save(request);

        checkRequestDTO.setRequestStatus("Declined");
        checkRequestDTO.setUserEmail(request.getUser().getEmail());

        return checkRequestDTO;
    }

    public String generateRandomString() {
        StringBuilder sb = new StringBuilder(LENGTH);

        for (int i = 0; i < LENGTH; i++) {
            int index = RANDOM.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }

        return sb.toString();
    }

    private void createRequestAndAddApprover(User user, User approver, String uniqueCode,
                                             RequestStatus status, RequestReason reason, ApproverAction action,
                                             RequestDTO requesT) {
        Request request = new Request();
        request.setStartDate(requesT.getStartDate());
        request.setFinishDate(requesT.getFinishDate());
        request.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        request.setUniqueCode(uniqueCode);
        request.setUser(user);
        request.setStatus(status);
        request.setReason(reason);
        request.setAction(action);
        request.setApproverId(approver);
        request.setComment(requesT.getComment());
        requestRepository.save(request);
    }

    @Caching(evict = {
            @CacheEvict(value = "allUserRequests", key = "'userId=' + #userId"),
            @CacheEvict(value = "combinedUserRequests", key = "'userId=' + #userId")
    })
    public AddRequestReturnDTO addRequest(int userId, RequestDTO requesT) {
        AddRequestReturnDTO addRequestReturnDTO = new AddRequestReturnDTO();
        String uniqueCode = generateRandomString();
        User user = userRepository.findById(userId).orElse(null);
        RequestStatus status = requestStatusRepository.findByStatus("Pending");
        RequestReason reason = requestReasonRepository.findByReason(requesT.getReason());
        ApproverAction action = approverActionRepository.findApproverActionByAction("Unchecked");
        RequestStatus statusCEO = requestStatusRepository.findByStatus("Approved");
        ApproverAction actionCEO = approverActionRepository.findApproverActionByAction("Approve");

        List<LocalDate> dates = new ArrayList<>();
        LocalDate startDate = requesT.getStartDate();
        LocalDate finishDate = requesT.getFinishDate();
        LocalDate currentDate = startDate;

        addRequestReturnDTO.setUserEmail(user.getEmail());

        if (user.getRole().getRole().equals("ROLE_CEO")) {
            Request request = new Request(requesT.getStartDate(), requesT.getFinishDate(),
                    new Timestamp(System.currentTimeMillis()), uniqueCode, new Timestamp(System.currentTimeMillis()),
                    user, user, statusCEO, reason, actionCEO, requesT.getComment());
            if (request.getReason().getReason().equals("Annual Leave")) {
                user.setDaysForVacation(user.getDaysForVacation() - (int)ChronoUnit.DAYS.between(request.getStartDate(),
                        request.getFinishDate()) - 1);
                userRepository.save(user);
            }
            if (request.getReason().getReason().equals("Personal Leave")) {
                user.setDaysToSkip(user.getDaysToSkip() - (int)ChronoUnit.DAYS.between(request.getStartDate(),
                        request.getFinishDate()) - 1);
                userRepository.save(user);
            }
            if (request.getReason().getReason().equals("Sick Leave")) {
                user.setDaysToSkip(user.getDaysToSkip() - (int)ChronoUnit.DAYS.between(request.getStartDate(),
                        request.getFinishDate()) - 1);
                userRepository.save(user);
            }

            requestRepository.save(request);

            while (!currentDate.isAfter(finishDate)) {
                dates.add(currentDate);
                currentDate = currentDate.plusDays(1);
            }

            for (LocalDate l : dates) {
                Report report = new Report(l, request.getReason().getReason(), user, request);

                //maybe remove work from home
                if (request.getReason().getReason().equals("Work from Home")) {
                    continue;
                } else {
                    report.setStatus("leave");
                }
                Report report1 = reportRepository.save(report);
                redisTemplate.opsForValue().set("report::reportId=" + report1.getId(), customObjectMappers.reportToDto(report1));
            }

            return addRequestReturnDTO;
        }

        assert user != null;
        if (user.getTeamLead() != null) {
            createRequestAndAddApprover(user, user.getTeamLead(), uniqueCode, status, reason, action, requesT);
            addRequestReturnDTO.setFirstApproverEmail(user.getTeamLead().getEmail());
        }
        if (user.getTechLead() != null) {
            createRequestAndAddApprover(user, user.getTechLead(), uniqueCode, status, reason, action, requesT);
            addRequestReturnDTO.setSecondApproverEmail(user.getTechLead().getEmail());
        }
        if (user.getPm() != null) {
            createRequestAndAddApprover(user, user.getPm(), uniqueCode, status, reason, action, requesT);
            addRequestReturnDTO.setThirdApproverEmail(user.getPm().getEmail());
        }

        return addRequestReturnDTO;
    }

    @Cacheable(value = "request", key = "'requestId=' + #id")
    public RequestDTO getRequestById(int id) {
        Request request = requestRepository.findById(id).orElse(null);
        RequestDTO requestDTO = new RequestDTO(request.getId(), request.getStartDate(), request.getFinishDate(),
                request.getCreatedAt(), request.getUniqueCode(), request.getDateOfResult(), request.getStatus().getStatus(),
                request.getReason().getReason(), request.getComment());

        return requestDTO;
    }

    @Caching(evict = {
            @CacheEvict(value = "allUserRequests", key = "'userId=' + #result.getUser().getId()"),
            @CacheEvict(value = "request", key = "'requestId=' + #id"),
            @CacheEvict(value = "combinedUserRequests", key = "'userId=' + #result.getUser().getId()")
    })
    public Request updateRequest(int id, RequestDTO requestDto) {
        Request request = requestRepository.findById(id).orElse(null);
        RequestReason reason = requestReasonRepository.findByReason(requestDto.getReason());
        ApproverAction action = approverActionRepository.findApproverActionByAction("Unchecked");
        List<Request> sameRequests = requestRepository.findAll();
        sameRequests = sameRequests.stream().filter(r-> {
            assert request != null;
            return r.getUniqueCode().equals(request.getUniqueCode());
        }).toList();

        sameRequests.forEach(r->{
            r.setReason(reason);
            r.setStartDate(requestDto.getStartDate());
            r.setFinishDate(requestDto.getFinishDate());
            r.setComment(requestDto.getComment());
            r.setAction(action);
            requestRepository.save(r);
        });

        return request;
    }

    @Caching(evict = {
            @CacheEvict(value = "allUserRequests", key = "'userId=' + #userId"),
            @CacheEvict(value = "combinedUserRequests", key = "'userId=' + #userId"),
            @CacheEvict(value = "request", key = "'requestId=' + #id")
    })
    public String deleteRequest(int id, int userId) {
        List<Report> reports = reportRepository.findAll();
        Request request = requestRepository.findById(id).orElse(null);
        List<Request> requests = requestRepository.findAll();
        reports.forEach(r-> {
            if (r.getRequest() != null) {
                if (r.getRequest().getId() == id) {
                    reportRepository.delete(r);
                }
            }
        });
        requests.forEach(r -> {
            if (r.getUniqueCode().equals(request.getUniqueCode())) {
                requestRepository.deleteById(r.getId());
            }
        });
        return "Request deleted";
    }

}
