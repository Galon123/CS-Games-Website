export interface CalendarEvent {
  id: string
  day: number
  title: string
  time: string
  isHighlighted: boolean
  venue?: string
  category?: string
  
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
      },
  {
    id: 'event-23',
    day: 23,
    title: 'BADMINTON DOUBLES DAY 1',
    time: '10:00',
    isHighlighted: false,
    venue: 'Indoor Stadium',
    category: 'Badminton',
      },
  {
    id: 'event-24',
    day: 24,
    title: 'CS CUP DAY 2',
    time: '09:00',
    isHighlighted: true,
    venue: 'Main Turf',
    category: 'Football',
      },
  {
    id: 'event-25',
    day: 25,
    title: 'CHESS & CARROMS',
    time: '14:00',
    isHighlighted: false,
    venue: 'Indoor Arena',
    category: 'Indoor Games',
      },
  {
    id: 'event-28-badminton',
    day: 28,
    title: 'BADMINTON DOUBLES DAY 2',
    time: '10:00',
    isHighlighted: false,
    venue: 'Indoor Stadium',
    category: 'Badminton',
      },
  {
    id: 'event-28-minimilitia',
    day: 28,
    title: 'MINI MILITIA',
    time: '18:00',
    isHighlighted: true,
    venue: 'E-Sports Arena',
    category: 'Esports',
      },
]

export const EVENTS_STORAGE_KEY = 'cs_september_events_v2'
