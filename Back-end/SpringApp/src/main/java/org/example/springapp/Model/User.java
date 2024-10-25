package org.example.springapp.Model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "User")
public class User {

    @Valid

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "first_name")
    @Size(min = 2, max = 50)
//    @NotEmpty(message = "First name should not be empty...")
    private String firstName;

    @Column(name = "second_name")
    @Size(min = 2, max = 50)
//    @NotEmpty(message = "Second name should not be empty...")
    private String secondName;

    @Column(name = "password")
//    @NotEmpty(message = "Password should not be empty...")
    private String password;

    @Column(name = "email")
    @Email
//    @NotEmpty(message = "Email should not be empty...")
    private String email;

    @Column(name = "image")
//    @NotEmpty(message = "Image should not be empty...")
    private String image;

    @Column(name = "days_for_vac")
    private int daysForVacation;

    @Column(name = "days_to_skip")
    private int daysToSkip;

    @ManyToOne
    @JoinColumn(name="role", referencedColumnName = "id")
    private UserRole role;

    @Column(name = "job_position")
    private String jobPosition;

    @ManyToOne
    @JoinColumn(name = "team_lead", referencedColumnName = "id")
    private User teamLead;

    @ManyToOne
    @JoinColumn(name = "tech_lead", referencedColumnName = "id")
    private User techLead;

    @ManyToOne
    @JoinColumn(name = "pm", referencedColumnName = "id")
    private User pm;

    @OneToMany(mappedBy = "user")
    @Column( name = "reports")
    private List<Report> reports;

    @OneToMany(mappedBy = "user")
    @Column(name = "requests")
    private List<Request> requests;

    @OneToMany(mappedBy = "approverId")
    @Column(name = "requests_to")
    private List<Request> requestsTo;

    public User(String firstName, String secondName, String password, String email, String image, int daysForVacation, int daysToSkip, String jobPosition) {
        this.firstName = firstName;
        this.secondName = secondName;
        this.password = password;
        this.email = email;
        this.image = image;
        this.daysForVacation = daysForVacation;
        this.daysToSkip = daysToSkip;
        this.jobPosition = jobPosition;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", secondName='" + secondName + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", image='" + image + '\'' +
                ", daysForVacation=" + daysForVacation +
                ", daysToSkip=" + daysToSkip +
                ", jobPosition='" + jobPosition + '\'' +
                '}';
    }
}
