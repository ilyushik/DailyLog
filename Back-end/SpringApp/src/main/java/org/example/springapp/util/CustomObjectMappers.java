package org.example.springapp.util;

import org.example.springapp.DTO.ReportDTO;
import org.example.springapp.DTO.RequestDTO;
import org.example.springapp.DTO.UserDTO;
import org.example.springapp.Model.Report;
import org.example.springapp.Model.Request;
import org.example.springapp.Model.User;
import org.springframework.stereotype.Component;

@Component
public class CustomObjectMappers {

    public ReportDTO reportToDto(Report report) {
        return new ReportDTO(report.getId(), report.getDate(), report.getText(),
                report.getCountOfHours(), report.getUser().getId(),
                report.getRequest() != null ? report.getRequest().getId() : null,
                report.getStatus());
    }

    public UserDTO userToDto(User user) {
        return new UserDTO(user.getId(), user.getFirstName(), user.getSecondName(),
                user.getEmail(), user.getPassword(), user.getImage(), user.getJobPosition(),
                user.getRole().getRole());
    }

    public RequestDTO requestToDto(Request request) {
        return new RequestDTO(request.getId(), request.getStartDate(), request.getFinishDate(),
                request.getCreatedAt(), request.getUniqueCode(), request.getDateOfResult(),
                request.getApproverId().getId(), request.getUser().getId(),
                request.getUser().getFirstName() + " " +
                        request.getUser().getSecondName(), request.getStatus().getStatus(),
                request.getReason().getReason(), request.getAction().getAction(),
                request.getComment());
    }
}
