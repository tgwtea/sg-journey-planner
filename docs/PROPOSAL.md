# Project proposal: SG Journey Planner

Source: `docs/WAD G5 Group 8 Project Proposal Template .pdf` (IS216 G5, Group 8).
This file is the durable text copy. If the PDF changes, update this file.

## Team

| # | Name | SMU email | Feature |
| --- | --- | --- | --- |
| 1 | Tan Guan Wei | guanwei.tan.2025@computing.smu.edu.sg | Smart Departure Recommender |
| 2 | Dillon Ang Jun Le | dillon.ang.2025@computing.smu.edu.sg | Rain-Aware Route Finder |
| 3 | Kong Jia Zhen, Amanda | amanda.kong.2025@computing.smu.edu.sg | Route Comparison with Live Conditions |
| 4 | Lu Jia Hong ("Woody") | jiahong.lu.2025@computing.smu.edu.sg | Weather-Triggered Trip Alerts / Saved Routes |
| 5 | Anumitaa Murali | anumitaa.m.2024@computing.smu.edu.sg | Community Reports & App Integration |

Note: the PDF roles table uses "Woody". Woody is Lu Jia Hong.

## Problem

Commuters in Singapore check separate services for routes, live bus arrivals, and weather
before they travel. This makes it hard to decide when to leave and which option to take.
Rain makes this harder, because it changes walking conditions and makes unsheltered stops
less desirable.

SG Journey Planner combines route options, live public-transport information, weather data,
and recent commuter reports in one application. Users make faster and better travel decisions.

## Features

### 1. Smart Departure Recommender (Tan Guan Wei)

The user enters an origin and a destination, or picks a saved route. The app combines journey
options, live transport timings, and current or near-term rain. A rule-based score uses travel
time, waiting time, transfers, and rain exposure. The app recommends "leave now" or "wait
briefly" and shows the main reason.

Responsibilities:
1. Build the origin/destination search and the journey request flow.
2. Get the public-transport route options.
3. Get live bus and transport timings where they apply.
4. Normalize route data (duration, transfers, walking distance, waiting time) for other features.
5. Handle the loading, failure, and no-route states of the transport API.

### 2. Rain-Aware Route Finder (Dillon)

The app shows nearby bus and MRT stops on a map, from LTA location data. Each stop is matched to
the nearest weather area or forecast. Users see which stops have rain and pick a better
boarding point.

Responsibilities:
1. Get the user's location (or a selected location) and the nearby bus and MRT stops.
2. Build the nearby-stop map.
3. Get current and near-term weather and rain information.
4. Match stop and route locations to the relevant weather area or forecast.
5. Give reusable weather information to the comparison, recommender, and saved-route features.

### 3. Route Comparison with Live Conditions (Amanda)

Users compare journey options between one origin and one destination by duration, transfers,
walking distance, live transport information, and current weather.

Responsibilities:
1. Build the rule-based journey scoring system.
2. Compare options by travel time, waiting time, transfers, walking distance, and rain exposure.
3. Generate "Leave now" / "Wait" recommendations.
4. Produce clear reasons for each recommendation.
5. Build the route-comparison screen. Test it with different journey and weather scenarios.

### 4. Weather-Triggered Trip Alerts / Saved Routes (Woody, Lu Jia Hong)

Users save frequent routes and their usual travel times. When the app opens, it checks the
forecast and shows a warning if rain is expected near a saved travel time.

Responsibilities:
1. Add and remove saved routes.
2. Store the user's usual travel and departure times.
3. Load saved journeys when the app starts.
4. Check upcoming weather against saved travel times.
5. Show a warning when rain can affect an upcoming saved journey.

### 5. Community Reports & App Integration (Anumitaa)

Users submit quick, predefined reports for a bus stop or MRT station: crowded,
sheltered/unsheltered, or wet. Each report has a timestamp and shows its age. Reports sort
newest first by default. Users can sort, filter, and search by date or report type.

Responsibilities:
1. Build the predefined report types (crowded, wet, sheltered/unsheltered).
2. Link each report to the correct bus stop or MRT station.
3. Timestamp reports and show their age. Sort newest first by default. Support sort, filter, and search.
4. Show recent reports in the stop and station views.
5. Own cross-feature integration and end-to-end testing.

## Engagement and interactivity ideas

- Distinct visual indicators for status (colour or icon states).
- Tap-to-expand details.
- Collapsible sections for each stop: a summary first, details on demand.
