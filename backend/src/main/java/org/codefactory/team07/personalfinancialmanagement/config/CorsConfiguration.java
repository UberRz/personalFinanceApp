package org.codefactory.team07.personalfinancialmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Auth endpoints
        registry.addMapping("/auth/**")
                .allowedOrigins("http://localhost:3000", "http://frontend:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);

        // Expenses endpoints
        registry.addMapping("/expenses/**")
                .allowedOrigins("http://localhost:3000", "http://frontend:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);

        // Actuator endpoints
        registry.addMapping("/actuator/**")
                .allowedOrigins("http://localhost:3000", "http://frontend:3000")
                .allowedMethods("GET", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
