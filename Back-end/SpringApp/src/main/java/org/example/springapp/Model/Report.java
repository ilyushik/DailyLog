package org.example.springapp.Model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Report")
public class Report {

    @Valid

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "date")
    @NotEmpty(message = "Date should not be empty")
    private LocalDate date;

    @Column(name = "text")
    @Size(min = 2, max = 1000, message = "Text should be between 2 and 1000")
    @NotEmpty(message = "Text should not be empty")
    private String text;

    @Column(name = "count_of_hours")
    @NotEmpty(message = "Count of hours should not be empty")
    private int countOfHours;

    @ManyToOne
    @JoinColumn(name = "user", referencedColumnName = "id")
    private User user;

    public Report(LocalDate date, String text, int countOfHours) {
        this.date = date;
        this.text = text;
        this.countOfHours = countOfHours;
    }

    @Override
    public String toString() {
        return "Report{" +
                "id=" + id +
                ", date=" + date +
                ", text='" + text + '\'' +
                ", countOfHours=" + countOfHours +
                '}';
    }
}
