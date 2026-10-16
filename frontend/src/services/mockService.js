import { lines } from '../mocks/lines.js';
import { routes } from '../mocks/routes.js';
import { stops, extraPlaces, tripPoints, nearbyStops } from '../mocks/stops.js';
import { savedRoutes, savedDefaults, alerts } from '../mocks/saved.js';
import { reportTypes, reports, reportPlaces } from '../mocks/reports.js';
import { weatherCopy, rainZones } from '../mocks/weather.js';

const copy = (value) => structuredClone(value);

export const getLineColours = async () => copy(lines);
export const getRouteOptions = async () => copy(routes);
export const getStops = async () => copy(stops);
export const getExtraPlaces = async () => copy(extraPlaces);
export const getTripPoints = async () => copy(tripPoints);
export const getNearbyStops = async () => copy(nearbyStops);
export const getSavedRoutes = async () => copy(savedRoutes);
export const getSavedDefaults = async () => copy(savedDefaults);
export const getAlerts = async () => copy(alerts);
export const getReportTypes = async () => copy(reportTypes);
export const getReports = async () => copy(reports);
export const getReportPlaces = async () => copy(reportPlaces);
export const getWeatherCopy = async () => copy(weatherCopy);
export const getRainZones = async () => copy(rainZones);
