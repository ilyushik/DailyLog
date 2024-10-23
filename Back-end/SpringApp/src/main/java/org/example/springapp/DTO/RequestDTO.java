package org.example.springapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;

@Data
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
    private String status;
    private String reason;
    private String action;
}
