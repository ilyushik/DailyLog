package org.example.springapp.Service;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.springapp.DTO.*;
import org.example.springapp.Model.Report;
import org.example.springapp.Model.User;
import org.example.springapp.Repository.ReportRepository;
import org.example.springapp.Repository.UserRepository;
import org.example.springapp.util.CustomObjectMappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;


    @Autowired
    private CustomObjectMappers customObjectMappers;

    @Cacheable(value = "userReports", key = "'userId=' + #userId")
    public List<ReportDTO> getReportsByUserId(int userId) {
        return reportRepository.findAll().stream().filter(s->s.getUser().getId() == userId)
                .map(r-> customObjectMappers.reportToDto(r)).collect(Collectors.toList());
    }

    @Cacheable(value = "userReports", key = "'reportId=' + #id")
    public ReportDTO reportById(int id) {
        Report report = reportRepository.findById(id).orElse(null);
        assert report != null;
        return customObjectMappers.reportToDto(report);
    }

    @CacheEvict(value = "userReports", key = "'userId=' + #user.id")
    public AddReportReturnDTO addReport(ReportDTO reportDTO, User user) {
        AddReportReturnDTO addReportReturnDTO = new AddReportReturnDTO();
        Report report = new Report(reportDTO.getDate(), reportDTO.getText(), reportDTO.getCountOfHours(),
                user, "work");
        Report savedReport = reportRepository.save(report);

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

        redisTemplate.opsForValue().set("report::reportId=" + savedReport.getId(),
                customObjectMappers.reportToDto(savedReport));

        addReportReturnDTO.setUserEmail(user.getEmail());
        addReportReturnDTO.setDays(user.getDaysForVacation());
        return addReportReturnDTO;
    }

    public List<ReportDTO> getAllReportsByUserPerPeriod(int userId, PeriodReport periodReport) {
        List<ReportDTO> reports = reportRepository.findAll().stream().filter(r-> r.getUser().getId() == userId)
                .map(s-> customObjectMappers.reportToDto(s)).collect(Collectors.toList());

        reports.removeIf(r->r.getDate().isBefore(periodReport.getStartDate()) ||
                r.getDate().isAfter(periodReport.getEndDate()));

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

        if (usersWorkReport.getCountOfHoursPerPeriod() == 0) {
            return null;
        }

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
                            .filter(r -> !r.getDate().isBefore(periodReport.getStartDate()) &&
                                    !r.getDate().isAfter(periodReport.getEndDate())).toList();

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

    @Caching(evict = {
            @CacheEvict(value = "report", key = "'reportId=' + #id"),
            @CacheEvict(value = "userReports", key = "'userId=' + #user.id")
    }, put = {
            @CachePut(value = "report", key = "'reportId=' + #id")
    })
    public Report updateReport(ReportDTO reportDto, int id, UserDTO user) {
        Report report = reportRepository.findById(id).orElse(null);
        assert report != null;
        report.setDate(reportDto.getDate());
        report.setText(reportDto.getText());
        report.setCountOfHours(reportDto.getCountOfHours());

        return reportRepository.save(report);
    }

    @Caching(evict = {
            @CacheEvict(value = "report", key = "'reportId=' + #id"),
            @CacheEvict(value = "userReports", key = "'userId=' + #userId")
    })
    public String deleteReport(int id, int userId) {
        reportRepository.deleteById(id);
        return "Report deleted";
    }

}
