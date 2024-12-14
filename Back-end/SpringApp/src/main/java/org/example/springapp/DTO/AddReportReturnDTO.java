package org.example.springapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddReportReturnDTO {
    private String userEmail;
    private int days;
}
