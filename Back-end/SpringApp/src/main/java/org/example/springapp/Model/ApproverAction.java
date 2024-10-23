package org.example.springapp.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Approver_Action")
public class ApproverAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "action")
    private String action;

    @OneToMany(mappedBy = "action")
    private List<Request> requests;

    public ApproverAction(String action) {
        this.action = action;
    }

    @Override
    public String toString() {
        return "ApproverAction{" +
                "id=" + id +
                ", action='" + action + '\'' +
                '}';
    }
}
