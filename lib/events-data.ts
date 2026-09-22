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
    id: 'event-8',
    day: 8,
    title: 'Cartoon Time',
    time: '10:00',
    isHighlighted: false,
    venue: 'Seminar Hall A',
    category: 'Media & Animation',
    description: 'Animated screenings and digital media sessions for department attendees.',
  },
  {
    id: 'event-10',
    day: 10,
    title: 'CDI Mock',
    time: '9:00/14:00',
    isHighlighted: true,
    venue: 'Main Campus Testing Center',
    category: 'Assessment',
    description: 'Official CDI Mock evaluation session with morning (9:00) and afternoon (14:00) examination slots.',
  },
  {
    id: 'event-15',
    day: 15,
    title: 'Spelling Bee',
    time: '10:00',
    isHighlighted: false,
    venue: 'Student Activity Center',
    category: 'Academic Contest',
    description: 'Annual inter-batch technical vocabulary and spelling championship.',
  },
  {
    id: 'event-22',
    day: 22,
    title: 'Kids Brain Train',
    time: '10:00',
    isHighlighted: false,
    venue: 'Seminar Hall B',
    category: 'Workshop',
    description: 'Cognitive problem-solving, puzzles, and algorithmic thinking fundamentals.',
  },
  {
    id: 'event-24',
    day: 24,
    title: 'CDI Mock',
    time: '9:00/14:00',
    isHighlighted: true,
    venue: 'Main Campus Testing Center',
    category: 'Assessment',
    description: 'Second round CDI Mock evaluation with dual 9:00 and 14:00 assessment windows.',
  },
  {
    id: 'event-26',
    day: 26,
    title: 'Brain Train',
    time: '13:30',
    isHighlighted: false,
    venue: 'Auditorium',
    category: 'Advanced Workshop',
    description: 'High-intensity logic challenges, data structure puzzles, and analytical team drills.',
  },
]

export const EVENTS_STORAGE_KEY = 'cs_september_events_v1'
