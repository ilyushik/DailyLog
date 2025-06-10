package org.example.springapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReportDTO {
    private String username;
    private String text;
    private int countOfHours;

    @Override
    public String toString() {
        return String.format("User: %s, Hours: %d, Text: %s", username, countOfHours, text);
    }

}
