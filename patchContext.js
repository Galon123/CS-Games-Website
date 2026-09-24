const fs = require('fs');

let content = fs.readFileSync('context/TournamentContext.tsx', 'utf8');

// Add LiveMatchData interface
if (!content.includes('export interface LiveMatchData')) {
    content = content.replace(
        'interface TournamentContextType {',
        `export interface LiveMatchData {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  time: string;
  isActive: boolean;
}

interface TournamentContextType {`
    );
}

// Add to Context type
if (!content.includes('liveMatch: LiveMatchData | null')) {
    content = content.replace(
        'refreshSupabaseData: () => Promise<void>',
        `refreshSupabaseData: () => Promise<void>
  liveMatch: LiveMatchData | null
  updateLiveMatch: (data: LiveMatchData | null) => void`
    );
}

// Add state to Provider
if (!content.includes('const [liveMatch, setLiveMatch] = useState<LiveMatchData | null>(null)')) {
    content = content.replace(
        'const [supabaseError, setSupabaseError] = useState<string | null>(null)',
        `const [supabaseError, setSupabaseError] = useState<string | null>(null)
  const [liveMatch, setLiveMatch] = useState<LiveMatchData | null>(null)`
    );
}

// Add localStorage effect for liveMatch
if (!content.includes('localStorage.getItem(\'cs-live-match\')')) {
    content = content.replace(
        'const storedAdmin = localStorage.getItem(\'cs-admin-status\')',
        `const storedAdmin = localStorage.getItem('cs-admin-status')
      const storedLiveMatch = localStorage.getItem('cs-live-match')
      if (storedLiveMatch) {
        try {
          setLiveMatch(JSON.parse(storedLiveMatch))
        } catch(e) {}
      }`
    );
}

// Add updateLiveMatch function
if (!content.includes('const updateLiveMatch = useCallback(')) {
    content = content.replace(
        'const updateFootballCarouselImages = useCallback(async (images: string[]) => {',
        `const updateLiveMatch = useCallback((data: LiveMatchData | null) => {
    setLiveMatch(data);
    if (data) {
      localStorage.setItem('cs-live-match', JSON.stringify(data));
    } else {
      localStorage.removeItem('cs-live-match');
    }
  }, []);

  const updateFootballCarouselImages = useCallback(async (images: string[]) => {`
    );
}

// Expose in Provider value
if (!content.includes('liveMatch,')) {
    content = content.replace(
        'refreshSupabaseData: fetchSupabaseData,',
        `refreshSupabaseData: fetchSupabaseData,
      liveMatch,
      updateLiveMatch,`
    );
}

fs.writeFileSync('context/TournamentContext.tsx', content);
console.log('TournamentContext patched successfully');
