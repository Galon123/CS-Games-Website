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
    title: 'BADMINTON DOUBLES DAY 1',
    time: '10:00',
    isHighlighted: false,
    venue: 'Indoor Stadium',
    category: 'Badminton',
    description: 'Badminton Doubles knockouts begin.',
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
    title: 'CHESS & CARROMS',
    time: '14:00',
    isHighlighted: false,
    venue: 'Indoor Arena',
    category: 'Indoor Games',
    description: 'Chess and Carroms tournaments.',
  },
  {
    id: 'event-28-badminton',
    day: 28,
    title: 'BADMINTON DOUBLES DAY 2',
    time: '10:00',
    isHighlighted: false,
    venue: 'Indoor Stadium',
    category: 'Badminton',
    description: 'Badminton Doubles finals.',
  },
  {
    id: 'event-28-minimilitia',
    day: 28,
    title: 'MINI MILITIA',
    time: '18:00',
    isHighlighted: true,
    venue: 'E-Sports Arena',
    category: 'Esports',
    description: 'Mini Militia competitive tournament.',
  },
]

export const EVENTS_STORAGE_KEY = 'cs_september_events_v2'
