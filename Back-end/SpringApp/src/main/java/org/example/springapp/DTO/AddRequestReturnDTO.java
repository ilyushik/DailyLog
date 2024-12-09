package org.example.springapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddRequestReturnDTO {
    private String userEmail;
    private String firstApproverEmail;
    private String secondApproverEmail;
    private String thirdApproverEmail;

    public AddRequestReturnDTO(String userEmail) {
        this.userEmail = userEmail;
    }

    public AddRequestReturnDTO(String userEmail, String firstApproverEmail) {
        this.userEmail = userEmail;
        this.firstApproverEmail = firstApproverEmail;
    }

    public AddRequestReturnDTO(String userEmail, String firstApproverEmail, String secondApproverEmail) {
        this.userEmail = userEmail;
        this.firstApproverEmail = firstApproverEmail;
        this.secondApproverEmail = secondApproverEmail;
    }
}
