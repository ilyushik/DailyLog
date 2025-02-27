package org.example.springapp.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {

    @Valid

    private int id;
    private LocalDate date;
    @Size(min = 2, max = 1000, message = "Text should be between 2 and 1000")
    private String text;
    private int countOfHours;
    private int user;
    private Integer request;
    private String status;

    public ReportDTO(LocalDate date, String text, int countOfHours, int user, String status) {
        this.date = date;
        this.text = text;
        this.countOfHours = countOfHours;
        this.user = user;
        this.status = status;
    }
}
