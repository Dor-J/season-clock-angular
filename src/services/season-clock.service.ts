import { storageService } from './async-storage.service.js';

const SEASON_KEY = 'seasonDB';
initializeSeason();

export const seasonClockService = {
  query,
};

function saveToStorage(key: string, val: any) {
  localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key: string) {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : null;
}

async function query() {
  const seasons = await storageService.query(SEASON_KEY);
  return seasons[0];
}

async function initializeSeason() {
  try {
    const existingSeasons = await storageService.query(SEASON_KEY);
    if (existingSeasons && existingSeasons.length > 0) {
      return;
    }

    const newSeason = await _createSeason();
    await storageService.post(SEASON_KEY, newSeason);
  } catch (error) {
    console.error('Error initializing season:', error);
  }
}

async function _createSeason() {
  const monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const date: Date = new Date();
  const month: string = monthNames[date.getMonth()];
  const dayOfWeek: string = dayNames[date.getDay()];

  const year = date.getFullYear();

  // check leap years
  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const seasonArray = [
    {
      name: 'Spring',
      date: new Date(
        year,
        2, // March (0-indexed)
        isLeapYear(year) ? 19 : 20
      ).getTime(),
    },
    {
      name: 'Summer',
      date: new Date(
        year,
        5, // June
        isLeapYear(year) ? 20 : 21
      ).getTime(),
    },
    {
      name: 'Autumn',
      date: new Date(
        year,
        8, // September
        isLeapYear(year) ? 22 : 23
      ).getTime(),
    },
    {
      name: 'Winter',
      date: new Date(
        year,
        11, // December
        isLeapYear(year) ? 20 : 21
      ).getTime(),
    },
  ];

  seasonArray.sort((a, b) => a.date - b.date);

  const currentTime = date.getTime();
  let currentSeason = seasonArray.find((season) => currentTime >= season.date);

  if (!currentSeason) {
    currentSeason = {
      name: 'Winter',
      date: new Date(
        year - 1,
        11, // December
        isLeapYear(year - 1) ? 20 : 21
      ).getTime(),
    };
  }

  const item: {
    season: string;
    month: string;
    dayOfWeek: string;
    id?: string;
  } = {
    season: currentSeason.name,
    month,
    dayOfWeek,
  };
  await storageService.post(SEASON_KEY, item);

  return item;
}
