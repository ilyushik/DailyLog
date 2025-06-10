package org.example.springapp.Repository;

import org.example.springapp.Model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    public Report findByDate(LocalDate date);

    @Query("SELECT r FROM Report r WHERE r.status = :status AND r.user.id IN :userIds AND r.date BETWEEN :startDate AND :endDate")
    List<Report> findReportsForUsersInMonth(
            @Param("status") String status,
            @Param("userIds") List<Integer> userIds,
            @Param("startDate") LocalDate start,
            @Param("endDate") LocalDate end
    );

}
