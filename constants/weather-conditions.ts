interface WeatherConditions {
    supportedIds: number[];
    supportedIcons: string[];
    supportedDescriptions: string[];
}

export const weatherConditions: WeatherConditions = {
    supportedIds: [
        200, 201, 202, 210, 211, 212, 221, 230, 231, 
        232, 300, 301, 302, 310, 311, 312, 313, 314, 
        321, 500, 501, 502, 503, 504, 511, 520, 521, 
        522, 531, 600, 601, 602, 611, 612, 613, 615, 
        616, 620, 621, 622, 701, 711, 721, 731, 741, 
        751, 761, 762, 771, 781, 800, 801, 802, 803, 
        804
    ],
    supportedIcons: [
        "01d", "01n", // Clear sky
        "02d", "02n", // Few clouds
        "03d", "03n", // Scattered clouds
        "04d", "04n", // Broken clouds
        "09d", "09n", // Shower rain
        "10d", "10n", // Rain
        "11d", "11n", // Thunderstorm
        "13d", "13n", // Snow
        "50d", "50n"  // Mist
    ],
    supportedDescriptions: [
        // Thunderstorm (2xx)
        "thunderstorm with light rain",       // 200
        "thunderstorm with rain",             // 201
        "thunderstorm with heavy rain",       // 202
        "light thunderstorm",                 // 210
        "thunderstorm",                       // 211
        "heavy thunderstorm",                 // 212
        "ragged thunderstorm",                // 221
        "thunderstorm with light drizzle",    // 230
        "thunderstorm with drizzle",          // 231
        "thunderstorm with heavy drizzle",    // 232

        // Drizzle (3xx)
        "light intensity drizzle",            // 300
        "drizzle",                            // 301
        "heavy intensity drizzle",            // 302
        "light intensity drizzle rain",       // 310
        "drizzle rain",                       // 311
        "heavy intensity drizzle rain",       // 312
        "shower rain and drizzle",            // 313
        "heavy shower rain and drizzle",      // 314
        "shower drizzle",                     // 321

        // Rain (5xx)
        "light rain",                         // 500
        "moderate rain",                      // 501
        "heavy intensity rain",               // 502
        "very heavy rain",                    // 503
        "extreme rain",                       // 504
        "freezing rain",                      // 511
        "light intensity shower rain",        // 520
        "shower rain",                        // 521
        "heavy intensity shower rain",        // 522
        "ragged shower rain",                 // 531

        // Snow (6xx)
        "light snow",                         // 600
        "snow",                               // 601
        "heavy snow",                         // 602
        "sleet",                              // 611
        "light shower sleet",                 // 612
        "shower sleet",                       // 613
        "light rain and snow",                // 615
        "rain and snow",                      // 616
        "light shower snow",                  // 620
        "shower snow",                        // 621
        "heavy shower snow",                  // 622

        // Atmosphere (7xx)
        "mist",                               // 701
        "smoke",                              // 711
        "haze",                               // 721
        "sand/dust whirls",                   // 731
        "fog",                                // 741
        "sand",                               // 751
        "dust",                               // 761
        "volcanic ash",                       // 762
        "squalls",                            // 771
        "tornado",                            // 781

        // Clear & Clouds (800)
        "clear sky",                          // 800
        "few clouds",                         // 801
        "scattered clouds",                   // 802
        "broken clouds",                      // 803
        "overcast clouds"                     // 804
    ]
};