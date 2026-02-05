package com.simpleblog.e2e;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.Alert;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AdminTest extends BaseTest {

    @Test
    void testAdminCreateAndDeletePost() throws IOException, InterruptedException {
        long timestamp = System.currentTimeMillis() / 1000;
        String username = "AdminUser" + timestamp;
        String email = "admin" + timestamp + "@example.com";
        String password = "password123";

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // 1. Register a new user
        driver.get(BASE_URL + "/register");
        
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("form input[type='text']"))).sendKeys(username);
        driver.findElement(By.cssSelector("form input[type='email']")).sendKeys(email);
        driver.findElement(By.cssSelector("form input[type='password']")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // Wait for navigation to home (auto-login after register)
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));

        // Logout
        driver.findElement(By.xpath("//button[contains(text(), 'Logout')]")).click();
        wait.until(ExpectedConditions.urlContains("/login"));

        // 2. Promote user to admin using the script
        promoteUserToAdmin(email);

        // 3. Login as the new admin
        driver.get(BASE_URL + "/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("form input[type='email']"))).sendKeys(email);
        driver.findElement(By.cssSelector("form input[type='password']")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // Verify we see the Admin Dashboard link and click it
        WebElement adminLink = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("a[href='/admin']")));
        assertTrue(adminLink.isDisplayed());
        
        // Go to Admin Dashboard
        adminLink.click();
        wait.until(ExpectedConditions.urlMatches(".*\\/admin$"));

        // 4. Create a new post
        driver.findElement(By.cssSelector("a[href='/admin/post/new']")).click();
        
        String postTitle = "Test Post " + timestamp;
        String postContent = "This is a test post content created by Selenium.";

        // Title
        List<WebElement> textInputs = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("form input[type='text']")));
        textInputs.get(0).sendKeys(postTitle);
        
        // Categories
        textInputs.get(2).sendKeys("Tech");

        // Content (Quill editor)
        WebElement editor = driver.findElement(By.cssSelector(".ql-editor"));
        editor.sendKeys(postContent);

        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // 5. Verify post appears in Admin Dashboard
        wait.until(ExpectedConditions.urlMatches(".*\\/admin$"));
        WebElement postItem = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(), '" + postTitle + "')]")));
        assertTrue(postItem.isDisplayed());

        // 6. Delete the post
        // Find the 'li' or container that has the text
        WebElement li = driver.findElement(By.xpath("//li[contains(., '" + postTitle + "')]"));
        WebElement deleteBtn = li.findElement(By.xpath(".//button[contains(text(), 'Delete')]"));
        
        deleteBtn.click();
        
        // Handle confirmation alert
        wait.until(ExpectedConditions.alertIsPresent());
        Alert alert = driver.switchTo().alert();
        alert.accept();

        // 7. Verify post is gone
        // We wait for it to disappear
        wait.until(ExpectedConditions.invisibilityOf(postItem));
    }

    private void promoteUserToAdmin(String email) throws IOException, InterruptedException {
        String projectRoot = new File(System.getProperty("user.dir")).getParentFile().getParentFile().getAbsolutePath();
        String scriptPath = projectRoot + File.separator + "server" + File.separator + "scripts" + File.separator + "admin_tools.js";
        
        ProcessBuilder pb = new ProcessBuilder("node", scriptPath, "promote", email);
        pb.directory(new File(projectRoot));
        pb.redirectErrorStream(true);
        Process process = pb.start();
        
        // Read output
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        StringBuilder output = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }
        
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Failed to promote user: " + output.toString());
        }
        if (!output.toString().contains("is now an admin")) {
            if (!output.toString().contains("User " + email + " is now an admin")) {
                 System.out.println("Warning: Output did not contain expected string (" + output + ")");
            }
        }
    }
}
