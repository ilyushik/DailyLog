package org.example.springapp.Repository;

import org.example.springapp.Model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    public Report findByDate(LocalDate date);
}
