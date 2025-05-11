import { test, expect, APIRequest, APIRequestContext } from "@playwright/test";
import { weatherConditions } from "../constants/weatherConditions";
import dotenv from 'dotenv';
dotenv.config();

test.describe("Current Weather Data API", () => {
    let apiContext;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const defaultLatitude: number = -14.745;
    const defaultLongitude: number = -75.079;
    const chineseChars: RegExp = /[\u4e00-\u9fff]+/;
    const koreanChars: RegExp = /[\u3131-\u318E\uAC00-\uD7AF]+/;
    const unauthorizedMessage: string = "Invalid API key. Please see https://openweathermap.org/faq#error401 for more info.";

    test.beforeAll(async ({ playwright }) => {
        apiContext = await playwright.request.newContext({
            baseURL: "https://api.openweathermap.org/data/2.5/weather"
        });
    });

    test.afterAll(async () => {
        await apiContext.dispose();
    });

    test("should return all properties", async () => {
        const response = await apiContext.get(
            `?appid=${apiKey}&lat=${defaultLatitude}&lon=${defaultLongitude}`
        );
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        const data = await response.json();

        expect(data).toEqual(expect.objectContaining({
            coord: expect.objectContaining({
                lon: expect.any(Number),
                lat: expect.any(Number)
            }),
            weather: expect.arrayContaining([expect.objectContaining({
                id: expect.any(Number),
                main: expect.any(String),
                description: expect.any(String),
                icon: expect.any(String)
            })]),
            base: expect.any(String),
            main: expect.objectContaining({
                temp: expect.any(Number),
                feels_like: expect.any(Number),
                temp_min: expect.any(Number),
                temp_max: expect.any(Number),
                pressure: expect.any(Number),
                humidity: expect.any(Number),
                sea_level: expect.any(Number),
                grnd_level: expect.any(Number)
            }),
            visibility: expect.any(Number),
            wind: expect.objectContaining({
                speed: expect.any(Number),
                deg: expect.any(Number),
                gust: expect.any(Number)
            }),
            clouds: expect.objectContaining({
                all: expect.any(Number)
            }),
            dt: expect.any(Number),
            sys: expect.any(Object),
            timezone: expect.any(Number),
            id: expect.any(Number),
            name: expect.any(String),
            cod: expect.any(Number)
        }));
    });

    test("should return consistent data", async () => {
        const response = await apiContext.get(
            `?appid=${apiKey}&lat=${defaultLatitude}&lon=${defaultLongitude}`
        );
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        const data = await response.json();  

        // Coordinate validation
        expect(data.coord).toHaveProperty("lat", defaultLatitude);
        expect(data.coord).toHaveProperty("lon", defaultLongitude);

        // Weather conditions validation
        expect(weatherConditions.supportedIds).toContain(data.weather[0].id);                   
        expect(weatherConditions.supportedIcons).toContain(data.weather[0].icon);                
        expect(weatherConditions.supportedDescriptions).toContain(data.weather[0].description);

        // Temperature validation
        expect(data.main.temp).toBeGreaterThan(0);
        expect(data.main.feels_like).toBeGreaterThan(0);
        expect(data.main.temp_min).toBeGreaterThanOrEqual(data.main.temp);
        expect(data.main.temp_max).toBeLessThanOrEqual(data.main.temp);

        // Atmospheric conditions
        expect(data.main.humidity).toBeGreaterThanOrEqual(0);
        expect(data.main.humidity).toBeLessThanOrEqual(100);
        expect(data.main.sea_level).toBeGreaterThan(0);
        expect(data.main.grnd_level).toBeGreaterThan(0);
        expect(data.visibility).toBeLessThanOrEqual(10000);

        // Wind conditions
        expect(data.wind.speed).toBeGreaterThanOrEqual(0);
        expect(data.wind.deg).toBeGreaterThanOrEqual(0);
        expect(data.wind.gust).toBeGreaterThanOrEqual(0);

        // Cloud coverage
        expect(data.clouds.all).toBeGreaterThanOrEqual(0);
        expect(data.clouds.all).toBeLessThanOrEqual(100);

        // Timezone validation
        expect(data.timezone).toBeGreaterThanOrEqual(-43200);
        expect(data.timezone).toBeLessThanOrEqual(50400);
    });

    [
        { metricOrImperial: "metric", scale: 1, offset: -273.15 },
        { metricOrImperial: "imperial", scale: 1.8, offset: -459.67 }
    ].forEach(({ metricOrImperial, scale, offset }) => {
        test(`should return ${metricOrImperial} units`, async () => {
            const defaultResponse = await apiContext.get(
                `?appid=${apiKey}&lat=${defaultLatitude}&lon=${defaultLongitude}`
            );
            expect(defaultResponse.ok()).toBeTruthy();
            expect(defaultResponse.status()).toBe(200);
            const defaultData = await defaultResponse.json();

            const metricOrImperialResponse = await apiContext.get(
                `?appid=${apiKey}&lat=${defaultLatitude}&lon=${defaultLongitude}&units=${metricOrImperial}`
            );
            expect(metricOrImperialResponse.ok()).toBeTruthy();
            expect(metricOrImperialResponse.status()).toBe(200);
            const metricOrImperialData = await metricOrImperialResponse.json();

            const temperatureFields = ["temp", "temp_min", "temp_max", "feels_like"];
            temperatureFields.forEach(field => {
                expect(metricOrImperialData.main[field]).toBeCloseTo(
                    (defaultData.main[field] * scale) + offset
                );
            });
        });
    });

    [
        { lat: 41.38, lon: 2.17, id: 6544106, country: "ES", city: "Ciutat Vella" },
        { lat: 40.71, lon: -74.00, id: 5128581, country: "US", city: "New York" },
        { lat: 48.85, lon: 2.35, id: 2988507, country: "FR", city: "Paris" },
        { lat: 52.52, lon: 13.40, id: 6545310, country: "DE", city: "Mitte" }
    ].forEach(({ lat, lon, id, country, city }) => {
        test(`should return city data from ${country}`, async () => {
            const response = await apiContext.get(
                `?appid=${apiKey}&lat=${lat}&lon=${lon}`
            );
            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);
            const data = await response.json();

            expect(data.sys.country).toBe(country);
            expect(data.name).toBe(city);
        });
    });

    [
        { language: "zh_cn", characterRange: chineseChars },
        { language: "kr", characterRange: koreanChars }
    ].forEach(({ language, characterRange }) => {
        test(`should return data translated into ${language}`, async () => {
            const response = await apiContext.get(
                `?appid=${apiKey}&lat=${defaultLatitude}&lon=${defaultLongitude}&lang=${language}`
            );
            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);
            const data = await response.json();

            expect(data.weather[0].description).toMatch(characterRange);
        });
    });

    [
        { format: "json", expectedHeaders: "application/json" },
        { format: "xml", expectedHeaders: "application/xml" },
        { format: "html", expectedHeaders: "text/html" }
    ].forEach(({ format, expectedHeaders }) => {
        test(`should return data in ${format}`, async () => {
            const response = await apiContext.get(
                `?appid=${apiKey}&lat=${defaultLatitude}&lon=${defaultLongitude}&mode=${format}`
            );
            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);
            const contentType = response.headers()["content-type"];

            expect(contentType).toContain(expectedHeaders);
        });
    });

    // Error handling tests
    test("should return Bad Request when API key is missing", async () => {
        const response = await apiContext.get(
            `?lat=${defaultLatitude}&lon=${defaultLongitude}`
        );
        expect(response.ok()).toBeFalsy();
        expect(response.status()).toBe(401);
        const data = await response.json();

        expect(data.message).toBe(unauthorizedMessage);
    });

    test("should return Bad Request when API key is invalid", async () => {
        const response = await apiContext.get(
            `?appid=INVALID_KEY&lat=${defaultLatitude}&lon=${defaultLongitude}`
        );
        expect(response.ok()).toBeFalsy();
        expect(response.status()).toBe(401);
        const data = await response.json();

        expect(data.message).toBe(unauthorizedMessage);
    });

    [
        { lat: 91, lon: 180, expectedMessage: "wrong latitude" },
        { lat: -91, lon: 180, expectedMessage: "wrong latitude" },
        { lat: 90, lon: 181, expectedMessage: "wrong longitude" },
        { lat: 90, lon: -181, expectedMessage: "wrong longitude" }
    ].forEach(({ lat, lon, expectedMessage }) => {
        test(`should reject ${expectedMessage} coordinate (${lat}, ${lon})`, async () => {
            const response = await apiContext.get(
                `?appid=${apiKey}&lat=${lat}&lon=${lon}`
            );
            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
            const data = await response.json();

            expect(data).toHaveProperty("message", expectedMessage);
        });
    });

    [
        { lat: "notACoordinate", lon: 90, unvalidCoordinate: "lat", message: "wrong latitude" },
        { lat: 90, lon: "notACoordinate", unvalidCoordinate: "lon", message: "wrong longitude" }
    ].forEach(({ lat, lon, unvalidCoordinate, message }) => {
        test(`should reject non-numeric ${unvalidCoordinate} coordinate`, async () => {
            const response = await apiContext.get(`?appid=${apiKey}&lat=${lat}&lon=${lon}`);
            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
            const data = await response.json();

            expect(data.message).toBe(message);
        });
    });

    [
        { presentCoordinate: "lat", missingCoordinate: "lon" },
        { presentCoordinate: "lon", missingCoordinate: "lat" }
    ].forEach(({ presentCoordinate, missingCoordinate }) => {
        test(`should require missing ${missingCoordinate} coordinate`, async () => {
            const response = await apiContext.get(
                `?appid=${apiKey}&${presentCoordinate}=90`
            );
            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
            const data = await response.json();

            expect(data.message).toBe("Nothing to geocode");
        });
    });
});