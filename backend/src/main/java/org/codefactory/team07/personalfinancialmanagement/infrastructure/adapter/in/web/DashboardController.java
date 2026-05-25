package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import lombok.RequiredArgsConstructor;
import org.codefactory.team07.personalfinancialmanagement.application.usecase.GetDashboardSummaryUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final GetDashboardSummaryUseCase getDashboardSummaryUseCase;

    @GetMapping("/{userId}")
    public ResponseEntity<DashboardSummaryDTO> getDashboardByUserId(
            @PathVariable Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long authenticatedUserId) {
        if (authenticatedUserId != null && !authenticatedUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(getDashboardSummaryUseCase.execute(userId));
    }

    @GetMapping("/me")
    public ResponseEntity<DashboardSummaryDTO> getMyDashboard(@RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(getDashboardSummaryUseCase.execute(userId));
    }
}