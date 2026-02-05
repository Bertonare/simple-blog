package com.simpleblog.e2e;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class AuthTest extends BaseTest {

    @Test
    void testRegisterAndLogin() {
        long timestamp = System.currentTimeMillis() / 1000;
        String email = "testuser" + timestamp + "@example.com";
        String password = "password123";
        String username = "TestUser" + timestamp;

        driver.get(BASE_URL + "/register");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        
        // Register
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("form input[type='text']"))).sendKeys(username);
        driver.findElement(By.cssSelector("form input[type='email']")).sendKeys(email);
        driver.findElement(By.cssSelector("form input[type='password']")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // Wait for redirection
        
        driver.get(BASE_URL + "/login");

        // Login
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("form input[type='email']"))).sendKeys(email);
        driver.findElement(By.cssSelector("form input[type='password']")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // Verify login success
        // Expect 'Logout' button to be visible
        WebElement logoutBtn = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[contains(text(), 'Logout')]")));
        assertTrue(logoutBtn.isDisplayed());
    }

    @Test
    void testLoginFailure() {
        driver.get(BASE_URL + "/login");
        
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("form input[type='email']"))).sendKeys("wrong@example.com");
        driver.findElement(By.cssSelector("form input[type='password']")).sendKeys("wrongpassword");
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        WebElement errorMsg = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(), 'Invalid email or password')]")));
        assertTrue(errorMsg.isDisplayed());
    }
}
