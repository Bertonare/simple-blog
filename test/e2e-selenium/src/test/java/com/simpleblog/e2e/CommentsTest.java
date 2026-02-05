package com.simpleblog.e2e;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class CommentsTest extends BaseTest {

    @Test
    void testCommentOnPost() throws IOException, InterruptedException {
        long timestamp = System.currentTimeMillis() / 1000;
        String adminEmail = "admin_c" + timestamp + "@example.com";
        String adminPass = "password123";
        String adminName = "Admin" + timestamp;
        
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // 1. Register/Promote Admin
        driver.get(BASE_URL + "/register");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("form input[type='text']"))).sendKeys(adminName);
        driver.findElement(By.cssSelector("form input[type='email']")).sendKeys(adminEmail);
        driver.findElement(By.cssSelector("form input[type='password']")).sendKeys(adminPass);
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));

        // Logout
        driver.findElement(By.xpath("//button[contains(text(), 'Logout')]")).click();
        
        // Promote
        promoteUserToAdmin(adminEmail);

        // Login Admin
        driver.get(BASE_URL + "/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("form input[type='email']"))).sendKeys(adminEmail);
        driver.findElement(By.cssSelector("form input[type='password']")).sendKeys(adminPass);
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("a[href='/admin']"))).click();
        
        // Create Post
        driver.findElement(By.cssSelector("a[href='/admin/post/new']")).click();
        String postTitle = "Comment Test Post " + timestamp;
        
        List<WebElement> textInputs = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("form input[type='text']")));
        textInputs.get(0).sendKeys(postTitle);
        textInputs.get(2).sendKeys("Discussion");
        driver.findElement(By.cssSelector(".ql-editor")).sendKeys("Post content for comments.");
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(), '" + postTitle + "')]")));
        
        // Logout Admin
        driver.findElement(By.xpath("//button[contains(text(), 'Logout')]")).click();
        
        // 2. User registers and comments
        String userName = "Commenter" + timestamp;
        String userEmail = "commenter" + timestamp + "@example.com";
        
        driver.get(BASE_URL + "/register");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("form input[type='text']"))).sendKeys(userName);
        driver.findElement(By.cssSelector("form input[type='email']")).sendKeys(userEmail);
        driver.findElement(By.cssSelector("form input[type='password']")).sendKeys("password123");
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));
        
        // Go to post
        driver.get(BASE_URL + "/");
        driver.findElement(By.xpath("//*[contains(text(), '" + postTitle + "')]")).click();
        
        // Add Comment
        String commentText = "This is a test comment " + timestamp;
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("textarea"))).sendKeys(commentText);
        driver.findElement(By.xpath("//button[contains(text(), 'Post Comment')]")).click();
        
        // Verify Comment
        WebElement comment = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(), '" + commentText + "')]")));
        assertTrue(comment.isDisplayed());
    }

    private void promoteUserToAdmin(String email) throws IOException, InterruptedException {
        String projectRoot = new File(System.getProperty("user.dir")).getParentFile().getParentFile().getAbsolutePath();
        String scriptPath = projectRoot + File.separator + "server" + File.separator + "scripts" + File.separator + "admin_tools.js";
        
        ProcessBuilder pb = new ProcessBuilder("node", scriptPath, "promote", email);
        pb.directory(new File(projectRoot));
        pb.redirectErrorStream(true);
        Process process = pb.start();
        process.waitFor();
    }
}
