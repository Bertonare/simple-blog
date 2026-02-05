package com.simpleblog.e2e;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class HomePageTest extends BaseTest {

    @Test
    void testHomePageLoads() {
        driver.get(BASE_URL);

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        // Check title
        wait.until(ExpectedConditions.titleIs("BlogSpace"));
        assertEquals("BlogSpace", driver.getTitle());

        // Check visible text
        WebElement brandElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(), 'Simple Space')]")));
        assertTrue(brandElement.isDisplayed());

        WebElement latestPosts = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(), 'Latest Posts')]")));
        assertTrue(latestPosts.isDisplayed());
    }
}
