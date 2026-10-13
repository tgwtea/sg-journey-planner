// Data access for every screen except weather.
// Each function returns mock data today. Replace the body with an `api` call
// when the backend route exists. Keep the function names, so views do not change.
import { routes } from '../mocks/routes.js';
import { stops } from '../mocks/stops.js';
import { savedRoutes, alerts } from '../mocks/saved.js';
import { reportTypes, reports } from '../mocks/reports.js';

const copy = (value) => structuredClone(value);

export const getRouteOptions = async () => copy(routes);
export const getNearbyStops = async () => copy(stops);
export const getSavedRoutes = async () => copy(savedRoutes);
export const getAlerts = async () => copy(alerts);
export const getReportTypes = async () => copy(reportTypes);
export const getReports = async () => copy(reports);
