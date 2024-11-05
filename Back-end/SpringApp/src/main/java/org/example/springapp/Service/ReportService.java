package org.example.springapp.Service;

import org.example.springapp.DTO.ReportDTO;
import org.example.springapp.Model.Report;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    public List<ReportDTO> getReportsByUserId(int userId) {
        return reportRepository.findAll().stream().filter(s->s.getUser().getId() == userId)
                .map(r-> new ReportDTO(r.getId(), r.getDate(), r.getText(), r.getCountOfHours(),
                        r.getUser().getId(), r.getRequest() != null ? r.getRequest().getId() : null, r.getStatus()))
                .collect(Collectors.toList());
    }

    public ReportDTO addReport(ReportDTO reportDTO, User user) {
        Report report = new Report(reportDTO.getDate(), reportDTO.getText(), reportDTO.getCountOfHours(),
                user, "work");
        reportRepository.save(report);
        return reportDTO;
    }
}
