package org.example.springapp.Service;

import org.example.springapp.DTO.ReportDTO;
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
                        r.getUser().getId(), r.getRequest().getId(), r.getStatus()))
                .collect(Collectors.toList());
    }
}
