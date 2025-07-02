package org.example.springapp.DTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Objects;

@Data
@Service
@AllArgsConstructor
@NoArgsConstructor
public class RequestDTO {

    @Valid

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
    @Size(min = 2, max = 1000, message = "Text should be between 2 and 1000")
    private String comment;

    public RequestDTO(int id, LocalDate startDate, LocalDate finishDate, Timestamp createdAt, String uniqueCode,
                      Timestamp dateOfResult, String status, String reason, String comment) {
        this.id = id;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.createdAt = createdAt;
        this.uniqueCode = uniqueCode;
        this.dateOfResult = dateOfResult;
        this.status = status;
        this.reason = reason;
        this.comment = comment;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RequestDTO that = (RequestDTO) o;
        return id == that.id && approver == that.approver && user == that.user && Objects.equals(startDate, that.startDate)
                && Objects.equals(finishDate, that.finishDate) && Objects.equals(createdAt, that.createdAt) &&
                Objects.equals(uniqueCode, that.uniqueCode) && Objects.equals(dateOfResult, that.dateOfResult) &&
                Objects.equals(fullUserName, that.fullUserName) && Objects.equals(status, that.status) &&
                Objects.equals(reason, that.reason) && Objects.equals(action, that.action) &&
                Objects.equals(comment, that.comment);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, startDate, finishDate, createdAt, uniqueCode, dateOfResult,
                approver, user, fullUserName, status, reason, action, comment);
    }

    @Override
    public String toString() {
        return "RequestDTO{" +
                "id=" + id +
                ", startDate=" + startDate +
                ", finishDate=" + finishDate +
                ", createdAt=" + createdAt +
                ", uniqueCode='" + uniqueCode + '\'' +
                ", dateOfResult=" + dateOfResult +
                ", approver=" + approver +
                ", user=" + user +
                ", fullUserName='" + fullUserName + '\'' +
                ", status='" + status + '\'' +
                ", reason='" + reason + '\'' +
                ", action='" + action + '\'' +
                ", comment='" + comment + '\'' +
                '}';
    }
}
