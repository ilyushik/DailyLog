package org.example.springapp.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ai_analysis")
public class AIAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "pm_id")
    private int pmId;

    @Column(name = "winner_fullname")
    private String winnerFullname;

    @Column(name = "reason")
    private String reason;

    @Column(name = "summary")
    private String summary;

    //for prod
    //@Column(name = "month")
    //for test
    @Column(name = "month_ai")
    private int month;

    //for prod
    //@Column(name = "year")
    //for test
    @Column(name = "year_ai")
    private int year;

    public AIAnalysis(int pmId, String winnerFullname, String reason, String summary, int month, int year) {
        this.pmId = pmId;
        this.winnerFullname = winnerFullname;
        this.reason = reason;
        this.summary = summary;
        this.month = month;
        this.year = year;
    }
}
