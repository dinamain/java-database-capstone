package com.project.back_end.mvc;

import com.project.back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
public class DashboardController {

    // 2. Autowire the token validation service
    @Autowired
    private UserService userService;

    // 3. Admin dashboard route
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable("token") String token) {
        // Validate token for role "admin"
        Map<String, Object> validation = userService.validateToken(token, "admin");

        if (validation.isEmpty()) {
            return "admin/adminDashboard";  // Template: src/main/resources/templates/admin/adminDashboard.html
        } else {
            return "redirect:/";  // Redirect to login/home
        }
    }

    // 4. Doctor dashboard route
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable("token") String token) {
        // Validate token for role "doctor"
        Map<String, Object> validation = userService.validateToken(token, "doctor");

        if (validation.isEmpty()) {
            return "doctor/doctorDashboard";  // Template: src/main/resources/templates/doctor/doctorDashboard.html
        } else {
            return "redirect:/";
        }
    }
}
