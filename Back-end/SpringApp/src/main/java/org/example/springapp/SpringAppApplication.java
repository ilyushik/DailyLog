package org.example.springapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class SpringAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringAppApplication.class, args);
    }

}
