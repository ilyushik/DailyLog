package org.example.springapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;

@Getter
@Service
@AllArgsConstructor
@NoArgsConstructor
public class RequestDTO {
    private int id;
    private LocalDate startDate;
    private LocalDate finishDate;
    private Timestamp createdAt;
    private String uniqueCode;
    private Timestamp dateOfResult;
    private int approver;
    private int user;
    private String fullUserName;
    private String status;
    private String reason;
    private String action;

    public RequestDTO(int id, LocalDate startDate, LocalDate finishDate, Timestamp createdAt, String uniqueCode, Timestamp dateOfResult, String status, String reason) {
        this.id = id;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.createdAt = createdAt;
        this.uniqueCode = uniqueCode;
        this.dateOfResult = dateOfResult;
        this.status = status;
        this.reason = reason;
    }
}
