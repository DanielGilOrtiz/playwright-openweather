# Automated API Testing for OpenWeather using Playwright

This project contains automated API tests for the OpenWeatherMap Current Weather Data API using Playwright.

## Prerequisites

- Node.js (v14 or higher)
- NPM (Node Package Manager)
- OpenWeatherMap API key ([Get it here](https://openweathermap.org/api))

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd open-weather-map
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

> Note: While `npm install` will install the Playwright framework, the last command is required to download the browser binaries that Playwright needs to run the tests.

## Configuration

Add your OpenWeatherMap API key to the `.env` file in the root directory:
```
OPENWEATHER_API_KEY = your_api_key_here
```

Replace `your_api_key_here` with your actual OpenWeatherMap API key.

## Running Tests

Run the tests using one of the following npm scripts:

```bash
# Run all tests
npm test

# Run tests with HTML report
npm run test:report

# Show HTML report
npm run show-report
```

## Project Structure

```
├── constants/
│   └── weatherConditions.ts                # Weather conditions mapping
├── tests/
│   └── currentWeatherData.spec.ts    
│   └── fiveDaysWeatherForecast.spec.ts     # TBC 
├── playwright.config.ts                    # Playwright configuration
├── package.json                            # Project dependencies
└── .env                                    # Environment variables
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key | Yes |

## Additional Resources

- [OpenWeatherMap API Documentation](https://openweathermap.org/current)
- [Playwright Documentation](https://playwright.dev)
- [dotenv Documentation](https://github.com/motdotla/dotenv)