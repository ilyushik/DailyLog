package org.example.springapp.Model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Request")
public class Request {

    @Valid

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "start_date")
//    @NotEmpty(message = "Not empty...")
    private LocalDate startDate;

    @Column(name = "finish_date")
//    @NotEmpty(message = "Not empty...")
    private LocalDate finishDate;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "unique_code")
    private String uniqueCode;

    @Column(name = "date_of_result")
    private Timestamp dateOfResult;

    @ManyToOne
    @JoinColumn(name = "approver_id", referencedColumnName = "id")
    private User approverId;

    @ManyToOne
    @JoinColumn(name = "user", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "status", referencedColumnName = "id")
    private RequestStatus status;

    @ManyToOne
    @JoinColumn(name = "reason", referencedColumnName = "id")
    private RequestReason reason;

    @ManyToOne
    @JoinColumn(name = "approver_action", referencedColumnName = "id")
    private ApproverAction action;

    @OneToMany(mappedBy = "request")
    private List<Report> report;

    private String comment;

    public Request(LocalDate startDate, LocalDate finishDate, Timestamp createdAt, String uniqueCode,
                   Timestamp dateOfResult, User approverId, User user, RequestStatus status,
                   RequestReason reason, ApproverAction action, String comment) {
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.createdAt = createdAt;
        this.uniqueCode = uniqueCode;
        this.dateOfResult = dateOfResult;
        this.approverId = approverId;
        this.user = user;
        this.status = status;
        this.reason = reason;
        this.action = action;
        this.comment = comment;
    }

    @Override
    public String toString() {
        return "Request{" +
                "id=" + id +
                ", startDate=" + startDate +
                ", finishDate=" + finishDate +
                ", createdAt=" + createdAt +
                ", uniqueCode='" + uniqueCode + '\'' +
                ", dateOfResult=" + dateOfResult +
                '}';
    }
}
