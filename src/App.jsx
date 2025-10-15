import React, { useState, useMemo } from 'react'
import './App.css'

// Predefined events array: { date (YYYY-MM-DD), title, description }
const EVENTS = [
  { date: '2025-10-05', title: 'Team Meeting', description: 'Discuss Q4 roadmap.' },
  { date: '2025-10-15', title: 'Project Deadline', description: 'Submit final deliverables.' },
  { date: '2025-10-20', title: 'Coffee with Sam', description: 'Catch up at the cafe.' },
  { date: '2025-10-15', title: 'Birthday', description: "Buy a gift and call." },
]

function getMonthData(year, month) {
  // month is 0-based (0 = January)
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days = []
  // fill leading empty days for week alignment (Sun = 0)
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null)

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }

  // pad the remaining cells to complete the last week
  while (days.length % 7 !== 0) days.push(null)

  return days
}

function formatDateISO(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function App() {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(null)

  const year = today.getFullYear()
  const month = today.getMonth()

  const monthDays = useMemo(() => getMonthData(year, month), [year, month])

  // map events by date for quick lookup
  const eventsByDate = useMemo(() => {
    const map = {}
    for (const ev of EVENTS) {
      if (!map[ev.date]) map[ev.date] = []
      map[ev.date].push(ev)
    }
    return map
  }, [])

  const selectedISO = selectedDate ? formatDateISO(selectedDate) : null
  const eventsForSelected = selectedISO ? eventsByDate[selectedISO] || [] : []

  return (
    <div className="app-root">
      <header>
        <h1>Interactive Calendar</h1>
        <p className="muted">Click a date to see events. Current month shown.</p>
      </header>

      <section className="calendar">
        <div className="month-header">
          <strong>
            {today.toLocaleString(undefined, { month: 'long' })} {year}
          </strong>
        </div>

        <div className="weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
            <div key={w} className="weekday">
              {w}
            </div>
          ))}
        </div>

        <div className="days-grid">
          {monthDays.map((dt, idx) => {
            const iso = dt ? formatDateISO(dt) : null
            const hasEvent = iso && eventsByDate[iso]
            const isSelected = selectedISO === iso

            return (
              <button
                key={idx}
                className={`day-cell ${dt ? '' : 'empty'} ${isSelected ? 'selected' : ''}`}
                onClick={() => dt && setSelectedDate(dt)}
                aria-pressed={isSelected}
                aria-label={dt ? `Select ${iso}` : 'Empty'}
                disabled={!dt}
              >
                <span className="date-number">{dt ? dt.getDate() : ''}</span>
                {hasEvent ? <span className="event-dot" aria-hidden="true">•</span> : null}
              </button>
            )
          })}
        </div>
      </section>

      <section className="events-panel">
        <h2>Events{selectedISO ? ` — ${selectedISO}` : ''}</h2>

        {selectedISO ? (
          eventsForSelected.length > 0 ? (
            <ul className="events-list">
              {eventsForSelected.map((ev, i) => (
                <li key={i} className="event-item">
                  <div className="event-title">{ev.title}</div>
                  <div className="event-desc">{ev.description}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No events for this date.</p>
          )
        ) : (
          <p className="muted">Select a date to view events.</p>
        )}
      </section>
    </div>
  )
}