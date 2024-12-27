package org.example.springapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsersWorkReport {
    private String firstName;
    private String secondName;
    private int pricePerHour;
    private int countOfHoursPerPeriod;
    private int sumHoursPricePerPeriod;
}
