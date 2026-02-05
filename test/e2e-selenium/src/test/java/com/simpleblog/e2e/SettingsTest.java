package com.simpleblog.e2e;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class SettingsTest extends BaseTest {

    @Test
    void testDarkModeToggle() {
        driver.get(BASE_URL + "/");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Find html element
        WebElement html = driver.findElement(By.tagName("html"));
        String rawInitialClass = html.getAttribute("class");
        final String initialClass = (rawInitialClass == null) ? "" : rawInitialClass;

        // Find toggle button
        WebElement toggleBtn = driver.findElement(By.cssSelector("button[aria-label='Toggle Theme']"));
        toggleBtn.click();

        // Verify class change
        wait.until(d -> {
            String tempClass = d.findElement(By.tagName("html")).getAttribute("class");
            if (tempClass == null) tempClass = "";
            return !tempClass.equals(initialClass);
        });
        
        String newClass = html.getAttribute("class");
        if (newClass == null) newClass = "";

        // If it was empty/light, now it should have dark?
        // Or if it had dark, now it should not?
        boolean initialHasDark = initialClass.contains("dark");
        boolean newHasDark = newClass.contains("dark");
        
        assertTrue(initialHasDark != newHasDark, "Dark mode should toggle");
    }

    @Test
    void testLanguageTranslation() {
        driver.get(BASE_URL + "/");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Default: Home visible
        WebElement navHome = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//nav//*[contains(text(), 'Home')]")));
        assertTrue(navHome.isDisplayed());

        // Find Toggle (EN) - Use contains(., 'EN') to be more robust (text might be in span)
        WebElement langToggle = driver.findElement(By.xpath("//button[contains(., 'EN')]"));
        langToggle.click();

        // Expect ID "Beranda"
        WebElement navBeranda = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//nav//*[contains(text(), 'Beranda')]")));
        assertTrue(navBeranda.isDisplayed());
        
        // Home should not be visible
        try {
            boolean homeVisible = driver.findElement(By.xpath("//nav//*[contains(text(), 'Home')]")).isDisplayed();
            assertFalse(homeVisible, "Home should not be visible after switch");
        } catch (Exception e) {
            // If element not found, that's good
        }

        // Toggle back
        // The button text might have changed to 'ID' or remained 'EN'
        try {
           driver.findElement(By.xpath("//button[contains(., 'ID')]")).click();
        } catch (Exception e) {
           // Maybe it still says EN?
           driver.findElement(By.xpath("//button[contains(., 'EN')]")).click();
        }

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//nav//*[contains(text(), 'Home')]")));
    }
}
