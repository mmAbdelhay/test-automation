import puppeteer from "puppeteer";

(async () => {
    // Launch a headless Chromium browser
    const browser = await puppeteer.launch({ headless: false });

    // Open a new page
    const page = await browser.newPage();

    // Navigate to The start point
    await page.goto("https://www.google.com");

    // Type the search query
    await page.type("textarea[name=q]", "muhammad abdelhay - Software Developer - _VOIS");

    // Press Enter to perform the search
    await page.keyboard.press("Enter");

    // Wait for the search results to load
    await page.waitForSelector("h3");

    // Extract and print the URL of the first search result
    const result = await page.$eval("h3", (element) => {
        return element.parentElement.getAttribute("href");
    });

    console.log("your linkedin account url is : ", result);

    // Close the browser
    await browser.close();
})();
