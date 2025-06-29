package com.project.back_end.mvc;

import com.project.back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@Controller
public class DashboardController {

    // Service for validating tokens & roles
    @Autowired
    private UserService userService;

    // Admin dashboard route with token validation
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable("token") String token) {
        Map<String, Object> validation = userService.validateToken(token, "admin");

        if (validation.isEmpty()) {
            // Token valid → show admin dashboard Thymeleaf template
            return "admin/adminDashboard";  // resolves to src/main/resources/templates/admin/adminDashboard.html
        } else {
            // Token invalid → redirect to login/home page
            return "redirect:/";
        }
    }

    // Doctor dashboard route with token validation
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable("token") String token) {
        Map<String, Object> validation = userService.validateToken(token, "doctor");

        if (validation.isEmpty()) {
            // Token valid → show doctor dashboard Thymeleaf template
            return "doctor/doctorDashboard";  // resolves to src/main/resources/templates/doctor/doctorDashboard.html
        } else {
            // Token invalid → redirect to login/home page
            return "redirect:/";
        }
    }
}
