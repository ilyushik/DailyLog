package org.example.springapp.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Request_Status")
public class RequestStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "status")
    private List<Request> requests;

    public RequestStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "RequestStatus{" +
                "id=" + id +
                ", status='" + status + '\'' +
                '}';
    }
}
