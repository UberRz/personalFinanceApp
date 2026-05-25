package org.codefactory.team07.personalfinancialmanagement.infrastructure.adapter.in.web;

import org.codefactory.team07.personalfinancialmanagement.application.usecase.GetDashboardSummaryUseCase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GetDashboardSummaryUseCase getDashboardSummaryUseCase;

    @Test
    void shouldReturnUnauthorizedWhenMeEndpointHasNoUserContext() throws Exception {
        mockMvc.perform(get("/dashboard/me").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturnDashboardForUserId() throws Exception {
        when(getDashboardSummaryUseCase.execute(5L)).thenReturn(new DashboardSummaryDTO());

        mockMvc.perform(get("/dashboard/5").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}