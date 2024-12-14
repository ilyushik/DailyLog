package org.example.springapp.Service;

import org.example.springapp.DTO.AddReportReturnDTO;
import org.example.springapp.DTO.ReportDTO;
import org.example.springapp.Model.Report;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.ReportRepository;
import org.example.springapp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private UserRepository userRepository;

    public List<ReportDTO> getReportsByUserId(int userId) {
        return reportRepository.findAll().stream().filter(s->s.getUser().getId() == userId)
                .map(r-> new ReportDTO(r.getId(), r.getDate(), r.getText(), r.getCountOfHours(),
                        r.getUser().getId(), r.getRequest() != null ? r.getRequest().getId() : null, r.getStatus()))
                .collect(Collectors.toList());
    }

    public AddReportReturnDTO addReport(ReportDTO reportDTO, User user) {
        AddReportReturnDTO addReportReturnDTO = new AddReportReturnDTO();
        Report report = new Report(reportDTO.getDate(), reportDTO.getText(), reportDTO.getCountOfHours(),
                user, "work");
        reportRepository.save(report);
        if (user.getDaysWorked() == null) {
            user.setDaysWorked(0);
            userRepository.save(user);
        }
        user.setDaysWorked(user.getDaysWorked() + 1);
        userRepository.save(user);
        if (user.getDaysWorked() == 10) {
            user.setDaysWorked(0);
            user.setDaysForVacation(user.getDaysForVacation() + 1);
            userRepository.save(user);
        }
        addReportReturnDTO.setUserEmail(user.getEmail());
        addReportReturnDTO.setDays(user.getDaysForVacation());
        return addReportReturnDTO;
    }
}
