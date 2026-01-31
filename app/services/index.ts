import { firebaseService } from './FirebaseService';
import { DataService } from './types';

import { defaultCalendarService } from './CalendarService';

// We can swap this out later for other implementations
const dataService: DataService = firebaseService;
const calendarService = defaultCalendarService;

export { dataService, calendarService };
export * from './types';
