package org.example.springapp.AI;

import com.theokanning.openai.audio.CreateTranscriptionRequest;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/chat-gpt")
@RequiredArgsConstructor
public class ChatGPTController {

    private final OpenAiService openAiService;

    @PostMapping("/transcribe")
    public String transcribeAudio(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        File tempFile = File.createTempFile("audio", ".mp3");
        multipartFile.transferTo(tempFile);

        CreateTranscriptionRequest request = new CreateTranscriptionRequest();
        request.setModel("whisper-1");

        String transcription = openAiService.createTranscription(request, tempFile).getText();

        tempFile.delete();

        return transcription;
    }
}
