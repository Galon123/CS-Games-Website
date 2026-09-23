export interface CalendarEvent {
  id: string
  day: number
  title: string
  time: string
  isHighlighted: boolean
  venue?: string
  category?: string
  description?: string
}

export const INITIAL_SEPTEMBER_EVENTS: CalendarEvent[] = [
  {
    id: 'event-22',
    day: 22,
    title: 'CS CUP DAY 1',
    time: '09:00',
    isHighlighted: true,
    venue: 'Main Turf',
    category: 'Football',
    description: 'Day 1 of the flagship CS Cup 6v6 Football Tournament.',
  },
  {
    id: 'event-23',
    day: 23,
    title: 'BADMINTON DOUBLES',
    time: '10:00',
    isHighlighted: false,
    venue: 'Indoor Stadium',
    category: 'Badminton',
    description: 'Badminton Doubles knockouts and finals.',
  },
  {
    id: 'event-24',
    day: 24,
    title: 'CS CUP DAY 2',
    time: '09:00',
    isHighlighted: true,
    venue: 'Main Turf',
    category: 'Football',
    description: 'Finals and concluding matches for the CS Cup.',
  },
  {
    id: 'event-25',
    day: 25,
    title: 'CHESS, CARROMS & MINI MILITIA',
    time: '14:00',
    isHighlighted: false,
    venue: 'Indoor & E-Sports Arena',
    category: 'Indoor & Esports',
    description: 'Chess, Carroms and Mini Militia tournaments.',
  },
]

export const EVENTS_STORAGE_KEY = 'cs_september_events_v2'
