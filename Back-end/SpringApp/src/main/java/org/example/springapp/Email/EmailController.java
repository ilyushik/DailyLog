package org.example.springapp.Email;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class EmailController {
    private final Resend resend = new Resend("re_DWHfdM6M_7L49D6b2Yq4uywv83dFpMY4V");

    @PostMapping("/send-email")
    public String sendEmail(@RequestBody EmailRequest emailRequest) {
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("DailyLog <onboarding@resend.dev>")
                .to(emailRequest.getUserEmail())
                .subject("")
                .html(emailRequest.getHtml())
                .build();

        try {
            CreateEmailResponse data = resend.emails().send(params);
            return "Email to " + emailRequest.getUserEmail() + " sent successfully";
        } catch (ResendException e) {
            e.printStackTrace();
            return "Failed to send email";
        }
    }
}
