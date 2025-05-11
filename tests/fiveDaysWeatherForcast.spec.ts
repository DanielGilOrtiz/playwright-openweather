// THIS IS ONLY A PLACEHOLDER FOR THE REAL TESTS FOR THE FIVE DAYS WEATHER FORECAST ENDPOINT
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe("Current Weather Data API", () => {
    let apiContext;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const defaultLatitude: number = -14.745;
    const defaultLongitude: number = -75.079;

    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({
            baseURL: "https://api.openweathermap.org/data/2.5/forecast"
        });
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });

    test.skip("should return all properties", async () => {
        const response = await apiContext.get(
            `?appid=${apiKey}&lat=${defaultLatitude}&lon=${defaultLongitude}`
        );
        expect(response.ok()).toBeTruthy();
        // TO BE COMPLETED
    });
});