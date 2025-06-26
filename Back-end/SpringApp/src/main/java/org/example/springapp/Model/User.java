package org.example.springapp.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "User")
public class User implements UserDetails {

    @Valid

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "first_name")
    @Size(min = 2, max = 50)
    private String firstName;

    @Column(name = "second_name")
    @Size(min = 2, max = 50)
    private String secondName;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    @Email
    private String email;

    @Column(name = "image")
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

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    @Column( name = "reports")
    private List<Report> reports;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    @Column(name = "requests")
    private List<Request> requests;

    @OneToMany(mappedBy = "approverId")
    @Column(name = "requests_to")
    private List<Request> requestsTo;

    @Column(name = "days_worked")
    private Integer daysWorked;

    @Column(name = "price_per_hour")
    private int pricePerHour;

    public User(String firstName, String secondName, String password, String email, String image,
                int daysForVacation, int daysToSkip, String jobPosition) {
        this.firstName = firstName;
        this.secondName = secondName;
        this.password = password;
        this.email = email;
        this.image = image;
        this.daysForVacation = daysForVacation;
        this.daysToSkip = daysToSkip;
        this.jobPosition = jobPosition;
    }

    public User(int id, String firstName, String secondName, String password, String email, String image,
                int daysForVacation, int daysToSkip, UserRole role, String jobPosition) {
        this.id = id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.password = password;
        this.email = email;
        this.image = image;
        this.daysForVacation = daysForVacation;
        this.daysToSkip = daysToSkip;
        this.role = role;
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getRole()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
