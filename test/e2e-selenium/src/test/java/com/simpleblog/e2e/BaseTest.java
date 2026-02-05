package com.simpleblog.e2e;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.time.Duration;

public class BaseTest {

    protected WebDriver driver;
    protected static final String BASE_URL = System.getenv("BASE_URL") != null ? System.getenv("BASE_URL") : "http://localhost:3000";
    private static final String MONGO_URI = System.getenv("MONGO_URI") != null ? System.getenv("MONGO_URI") : "mongodb://localhost:27017/mern-blog";

    @BeforeAll
    static void setupClass() {
        WebDriverManager.chromedriver().browserVersion("143").setup();
        cleanupDb();
    }

    @BeforeEach
    void setup() {
        ChromeOptions options = new ChromeOptions();
        // Use Playwright's Chromium
        options.setBinary("/home/berton/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome");
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @AfterEach
    void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    protected static void cleanupDb() {
        try (MongoClient mongoClient = MongoClients.create(MONGO_URI)) {
            MongoDatabase database = mongoClient.getDatabase("mern-blog");
            
            // Delete test users (starting with testuser or admin and followed by digits)
            database.getCollection("users").deleteMany(new Document("email", new Document("$regex", "^(testuser|admin)\\d+@example\\.com$")));
            
            // Delete test posts (starting with Test Post or Comment Test Post)
            database.getCollection("posts").deleteMany(new Document("title", new Document("$regex", "^(Test Post|Comment Test Post)")));
            
            System.out.println("Cleaned up test data.");
        } catch (Exception e) {
            System.err.println("Error during DB cleanup: " + e.getMessage());
        }
    }
}
