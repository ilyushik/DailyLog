package org.example.springapp.Service;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.springapp.DTO.AddReportReturnDTO;
import org.example.springapp.DTO.PeriodReport;
import org.example.springapp.DTO.ReportDTO;
import org.example.springapp.DTO.UsersWorkReport;
import org.example.springapp.Model.Report;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.ReportRepository;
import org.example.springapp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
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

    public List<ReportDTO> getAllReportsByUserPerPeriod(int userId, PeriodReport periodReport) {
        List<ReportDTO> reports = reportRepository.findAll().stream().filter(r-> r.getUser().getId() == userId)
                .map(s-> {
                    ReportDTO reportDTO = new ReportDTO();
                    reportDTO.setId(s.getId());
                    reportDTO.setDate(s.getDate());
                    reportDTO.setText(s.getText());
                    reportDTO.setCountOfHours(s.getCountOfHours());
                    reportDTO.setUser(s.getUser().getId());
                    reportDTO.setRequest(s.getRequest() != null ? s.getRequest().getId() : null);
                    reportDTO.setStatus(s.getStatus());

                    return reportDTO;
                }).collect(Collectors.toList());

        reports.removeIf(r->r.getDate().isBefore(periodReport.getStartDate()) || r.getDate().isAfter(periodReport.getEndDate()));

        return reports;
    }

    public UsersWorkReport getUsersWorkReport(int userId, PeriodReport periodReport) {
        User user = userRepository.findById(userId).orElse(null);
        int countOfUsersHours = 0;
        UsersWorkReport usersWorkReport = new UsersWorkReport();

        for (ReportDTO reportDTO : getAllReportsByUserPerPeriod(userId, periodReport)) {
            countOfUsersHours += reportDTO.getCountOfHours();
        }

        assert user != null;
        usersWorkReport.setFirstName(user.getFirstName());
        usersWorkReport.setSecondName(user.getSecondName());
        usersWorkReport.setPricePerHour(user.getPricePerHour());
        usersWorkReport.setCountOfHoursPerPeriod(countOfUsersHours);
        usersWorkReport.setSumHoursPricePerPeriod(user.getPricePerHour() * countOfUsersHours);

        return usersWorkReport;
    }

    // method to generate excel file
    public byte[] createExcelUserById(int userId, PeriodReport periodReport) throws IOException {
        UsersWorkReport usersWorkReport = getUsersWorkReport(userId, periodReport);
        String name = usersWorkReport.getFirstName() + "_" + usersWorkReport.getSecondName();

        try(Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("report");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Name");
            header.createCell(1).setCellValue("Surname");
            header.createCell(2).setCellValue("Price per hour");
            header.createCell(3).setCellValue("Count of hours");
            header.createCell(4).setCellValue("Total");

            Row row = sheet.createRow(1);
            row.createCell(0).setCellValue(usersWorkReport.getFirstName());
            row.createCell(1).setCellValue(usersWorkReport.getSecondName());
            row.createCell(2).setCellValue(usersWorkReport.getPricePerHour());
            row.createCell(3).setCellValue(usersWorkReport.getCountOfHoursPerPeriod());
            row.createCell(4).setCellValue(usersWorkReport.getSumHoursPricePerPeriod());

            workbook.write(outputStream);
            workbook.close();
            return outputStream.toByteArray();
        }
    }

    public byte[] createExcelUsers(int userId, PeriodReport periodReport) throws IOException {
        List<User> users = userRepository.findAll();
        users.removeIf(s->s.getJobPosition().equals("Project Manager"));

        try(Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("report");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Name");
            header.createCell(1).setCellValue("Surname");
            header.createCell(2).setCellValue("Price per hour");
            header.createCell(3).setCellValue("Count of hours");
            header.createCell(4).setCellValue("Total");

            int rowNum = 1;

            for (User user : users) {
                if (user.getPm() != null && user.getPm().getId() == userId) {
                    List<Report> reports = reportRepository.findAll().stream()
                            .filter(r -> r.getUser().getId() == user.getId())
                            .filter(r -> !r.getDate().isBefore(periodReport.getStartDate()) && !r.getDate().isAfter(periodReport.getEndDate()))
                            .toList();

                    if (!reports.isEmpty()) {
                        UsersWorkReport usersWorkReport = getUsersWorkReport(user.getId(), periodReport);
                        Row row = sheet.createRow(rowNum);
                        row.createCell(0).setCellValue(usersWorkReport.getFirstName());
                        row.createCell(1).setCellValue(usersWorkReport.getSecondName());
                        row.createCell(2).setCellValue(usersWorkReport.getPricePerHour());
                        row.createCell(3).setCellValue(usersWorkReport.getCountOfHoursPerPeriod());
                        row.createCell(4).setCellValue(usersWorkReport.getSumHoursPricePerPeriod());
                        rowNum++;
                    }
                }
            }


            workbook.write(outputStream);
            workbook.close();
            return outputStream.toByteArray();
        }
    }


    //test
    public byte[] excelTest() throws IOException {

        try(Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("report");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Name");
            header.createCell(1).setCellValue("Surname");

            Row row = sheet.createRow(1);
            row.createCell(0).setCellValue("Illia");
            row.createCell(1).setCellValue("Kamarali");


            workbook.write(outputStream);
            workbook.close();
            return outputStream.toByteArray();
        }
    }

}
