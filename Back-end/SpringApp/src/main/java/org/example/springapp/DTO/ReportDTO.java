package org.example.springapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {
    private int id;
    private LocalDate date;
    private String text;
    private int countOfHours;
    private int user;
    private int request;
    private String status;
}
