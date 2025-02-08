package org.example.springapp.Controller;

import jakarta.validation.Valid;
import org.example.springapp.DTO.PeriodReport;
import org.example.springapp.DTO.ReportDTO;
import org.example.springapp.Model.Report;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.ReportRepository;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/report")
public class ReportController {

    @Autowired
    private ReportService reportService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReportRepository reportRepository;

    @GetMapping("/usersReports")
    public ResponseEntity<?> getReport() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        assert user != null;
        if (reportService.getReportsByUserId(user.getId()).isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "No reports"));
        }

        return ResponseEntity.ok(reportService.getReportsByUserId(user.getId()));
    }

    @GetMapping("/usersReports/{id}")
    public ResponseEntity<?> getReportByUser(@PathVariable int id) {
        if (reportService.getReportsByUserId(id).isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "No reports"));
        }

        return ResponseEntity.ok(reportService.getReportsByUserId(id));
    }

    @PostMapping("add-report")
    public ResponseEntity<?> addReport(@Valid @RequestBody ReportDTO reportDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        List<ReportDTO> usersReportsByDate = reportService.getReportsByUserId(user.getId()).stream().filter(s->s.getDate().equals(reportDTO.getDate()) && s.getRequest() == null).toList();
        List<ReportDTO> usersRequestsByDate = reportService.getReportsByUserId(user.getId()).stream().filter(s->s.getDate().equals(reportDTO.getDate()) && s.getRequest() != null).toList();
        if (!usersReportsByDate.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "You already have a report on this date"));
        }
        if (!usersRequestsByDate.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "You already have a request on this date"));
        }
        if (reportDTO.getCountOfHours() > 8) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("hours", "Work day can not be more than 8 hours"));
        }
        if (reportDTO.getDate().isAfter(LocalDate.now())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("date", "That day has not yet come"));
        }

        return ResponseEntity.ok(reportService.addReport(reportDTO, user));
    }

    // download all users
    @GetMapping("/download/excel")
    public ResponseEntity<?> downloadReportExcel(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        PeriodReport periodReport = new PeriodReport();
        periodReport.setStartDate(LocalDate.parse(startDate));
        periodReport.setEndDate(LocalDate.parse(endDate));

        if (periodReport.getStartDate().isAfter(periodReport.getEndDate())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("dateEr", "Start date can not be after end date"));
        }
        if (periodReport.getStartDate().isAfter(LocalDate.now()) || periodReport.getEndDate().isAfter(LocalDate.now())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("dateEr", "Date can not be after current date"));
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(reportService.createExcelUsers(user.getId(), periodReport));
    }


    //test
    @GetMapping("/excel/download")
    public ResponseEntity<?> restExcel() throws IOException {
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(reportService.excelTest());
    }

    //download one user by id
    @GetMapping("/download/excel/{id}")
    public ResponseEntity<?> downloadReportExcel(@PathVariable int id, @RequestBody PeriodReport periodReport) throws IOException {
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(reportService.createExcelUserById(id, periodReport));
    }

    //test
    @PostMapping("usersReport-perPeriod/{id}")
    public ResponseEntity<?> usersReportsPerPeriod(@PathVariable("id") int userId, @RequestBody PeriodReport periodReport) {
        if (periodReport.getStartDate().isAfter(periodReport.getEndDate())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("dateEr", "Start date can not be after end date"));
        }
        if (periodReport.getStartDate().isAfter(LocalDate.now()) || periodReport.getEndDate().isAfter(LocalDate.now())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("dateEr", "Date can not be after current date"));
        }
        if (reportService.getUsersWorkReport(userId, periodReport) == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "User has no reports"));
        }

        return ResponseEntity.ok(reportService.getUsersWorkReport(userId, periodReport));
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateReport(@PathVariable int id, @RequestBody ReportDTO reportDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        List<Report> usersReports = reportRepository.findAll();
        usersReports = usersReports.stream().filter(r-> r.getUser().equals(user)).toList();

        for (Report r : usersReports) {
            if (r.getDate().equals(reportDTO.getDate())) {
                if (r.getId() != reportDTO.getId()) {
                    return ResponseEntity.badRequest().body(Collections.singletonMap("date", "Report already exists"));
                }
            }
        }

        return ResponseEntity.ok(reportService.updateReport(reportDTO, id));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteReport(@RequestBody int id) {
        Report report = reportRepository.findById(id).orElse(null);
        if (report == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Report not found"));
        }

        return ResponseEntity.ok(reportService.deleteReport(id));
    }
}
