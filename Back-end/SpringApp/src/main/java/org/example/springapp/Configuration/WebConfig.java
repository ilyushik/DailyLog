package org.example.springapp.Configuration;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebMvc
public class WebConfig {

    private String frontendLinkCorsDisable = "http://localhost:3000";
    // private String frontendLinkCorsDisable="http://dailylogclient.s3-website.eu-central-1.amazonaws.com";

    private String mobileLinkCorsDisable = "http://192.168.0.137:8081";

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        // Добавляем разрешенные источники
        config.setAllowedOriginPatterns(Arrays.asList(frontendLinkCorsDisable, mobileLinkCorsDisable));

        config.setAllowedHeaders(Collections.singletonList("*"));
        config.setAllowedMethods(Collections.singletonList("*"));
        config.setMaxAge(3600L);
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(-102);
        return bean;
    }
}
