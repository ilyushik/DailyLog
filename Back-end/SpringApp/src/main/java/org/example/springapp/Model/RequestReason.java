package org.example.springapp.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Request_Reason")
public class RequestReason {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "reason")
    private String reason;

    @OneToMany(mappedBy = "reason")
    private List<Request> requests;

    public RequestReason(String reason) {
        this.reason = reason;
    }

    @Override
    public String toString() {
        return "RequestReason{" +
                "id=" + id +
                ", reason='" + reason + '\'' +
                '}';
    }
}
