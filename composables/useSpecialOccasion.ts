interface ArrowColors {
  background: string // Background rect (#111111)
  grey: string       // Corner/edge left-pointing arrows (#424242)
  white: string      // Right-pointing arrow (#ffffff)
  red: string        // Right-pointing arrow, offset (#cc0000)
  black: string      // Dark left-pointing arrows above background (#111111)
}

interface DateRange {
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
}

// Fixed occasions use month/day directly; dynamic ones compute the range per year
type OccasionDate =
  | { type: 'fixed', startMonth: number, startDay: number, endMonth: number, endDay: number }
  | { type: 'dynamic', getRange: (year: number) => DateRange }

interface SpecialOccasion {
  name: string
  date: OccasionDate
  colors: ArrowColors
}

// --- Dynamic date helpers ---

// Chinese New Year: approximation using the lunisolar calendar.
// New moons for January/February by year. Add more years as needed.
const chineseNewYearDates: Record<number, [number, number]> = {
  2025: [1, 29],
  2026: [2, 17],
  2027: [2, 6],
  2028: [1, 26],
  2029: [2, 13],
  2030: [2, 3],
  2031: [1, 23],
  2032: [2, 11],
  2033: [1, 31],
  2034: [2, 19],
  2035: [2, 8],
}

function chineseNewYear(year: number): DateRange {
  const entry = chineseNewYearDates[year]
  if (!entry) {
    // Fallback: late January to mid February covers most years
    return { startMonth: 1, startDay: 25, endMonth: 2, endDay: 10 }
  }
  const [month, day] = entry
  // Show theme from 1 day before to 3 days after
  const start = new Date(year, month - 1, day - 1)
  const end = new Date(year, month - 1, day + 3)
  return {
    startMonth: start.getMonth() + 1, startDay: start.getDate(),
    endMonth: end.getMonth() + 1, endDay: end.getDate(),
  }
}

// Helper to create fixed occasions concisely
function fixed(startMonth: number, startDay: number, endMonth: number, endDay: number): OccasionDate {
  return { type: 'fixed', startMonth, startDay, endMonth, endDay }
}

function dynamic(getRange: (year: number) => DateRange): OccasionDate {
  return { type: 'dynamic', getRange }
}

// --- Occasions ---

const occasions: SpecialOccasion[] = [
  {
    name: 'Christmas',
    date: fixed(12, 20, 12, 26),
    colors: { background: '#111111', grey: '#ffffff', white: '#10d914', red: '#ff0000', black: '#ffffff' },
  },
  {
    name: 'New Year',
    date: fixed(12, 31, 1, 2),
    colors: { background: '#111111', grey: '#c9b037', white: '#ffffff', red: '#e8d44d', black: '#151540' },
  },
  {
    name: 'Chinese New Year',
    date: dynamic(chineseNewYear),
    colors: { background: '#8b0000', grey: '#ffd700', white: '#ffffff', red: '#ff4500', black: '#000033' },
  },
  {
    name: 'Valentine\'s Day',
    date: fixed(2, 13, 2, 15),
    colors: { background: '#111111', grey: '#8b2252', white: '#ff69b4', red: '#ff1493', black: '#3d1428' },
  },
  {
    name: 'Halloween',
    date: fixed(10, 25, 11, 1),
    colors: { background: '#111111', grey: '#4a2080', white: '#ff8c00', red: '#8b00ff', black: '#25143d' },
  },
  {
    name: 'St. Patrick\'s Day',
    date: fixed(3, 16, 3, 18),
    colors: { background: '#111111', grey: '#1e7a1e', white: '#ffffff', red: '#00cc44', black: '#142814' },
  },
  {
    name: 'Kijin Seija Day',
    date: fixed(8, 8, 8, 8),
    colors: { background: '#1a0a0a', grey: '#5a2727', white: '#ff4444', red: '#ffffff', black: '#281414' },
  },
  {
    name: 'April Fools',
    date: fixed(4, 1, 4, 1),
    colors: { background: '#EEEEEE', grey: '#BDBDBD', white: '#000000', red: '#33FFFF', black: '#EEEEEE' },
  },
]

// --- Date matching ---

function isDateInRange(now: Date, occasion: SpecialOccasion): boolean {
  const range = occasion.date.type === 'fixed'
    ? occasion.date
    : occasion.date.getRange(now.getFullYear())

  const month = now.getMonth() + 1
  const day = now.getDate()
  const current = month * 100 + day
  const start = range.startMonth * 100 + range.startDay
  const end = range.endMonth * 100 + range.endDay

  // Handle ranges that wrap around year boundary (e.g. Dec 31 - Jan 2)
  if (start > end) {
    return current >= start || current <= end
  }
  return current >= start && current <= end
}

const defaultColors: ArrowColors = {
  background: '#111111',
  grey: '#424242',
  white: '#ffffff',
  red: '#cc0000',
  black: '#111111',
}

export function useSpecialOccasion() {
  const route = useRoute()
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval> | null = null

  if (import.meta.client) {
    onMounted(() => {
      // Check every minute for occasion changes
      timer = setInterval(() => { now.value = new Date() }, 60_000)
    })
    onUnmounted(() => {
      if (timer) clearInterval(timer)
    })
  }

  const occasion = computed(() => {
    const override = (route.query.occasion as string)?.toLowerCase()
    if (override) {
      return occasions.find(o => o.name.toLowerCase().includes(override)) ?? null
    }
    return occasions.find(o => isDateInRange(now.value, o)) ?? null
  })

  const colors = computed(() => occasion.value?.colors ?? defaultColors)
  const occasionName = computed(() => occasion.value?.name ?? null)

  const colorVars = computed(() => {
    const c = colors.value
    return {
      '--arrow-bg': c.background,
      '--arrow-grey': c.grey,
      '--arrow-white': c.white,
      '--arrow-red': c.red,
      '--arrow-black': c.black,
    } as Record<string, string>
  })

  return { occasion, colors, colorVars, occasionName }
}
