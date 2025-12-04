import { useState, useEffect } from 'react';

export function MetricsPanel({ allCheats, languages, categories }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const memoryUsage = Math.min(100, (allCheats.length / 50) * 100);
  const cpuLoad = Math.floor(Math.random() * 20) + 40;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="metrics-container">
      <div className="metrics-panel">
        <pre className="metrics-content">
{`┌─[ SYSTEM METRICS ]──────────────────────────┐
│                                              │
│  MEM [${'█'.repeat(Math.floor(memoryUsage/5))}${'░'.repeat(20 - Math.floor(memoryUsage/5))}] ${Math.floor(memoryUsage).toString().padStart(3)}%        │
│  CPU [${'█'.repeat(Math.floor(cpuLoad/5))}${'░'.repeat(20 - Math.floor(cpuLoad/5))}] ${cpuLoad.toString().padStart(3)}%        │
│  NET [${'█'.repeat(15)}${'░'.repeat(5)}] STABLE      │
│                                              │
│  CHEATS LOADED: ${allCheats.length.toString().padStart(3)}                       │
│  LANGUAGES: ${languages.length.toString().padStart(3)}                           │
│  CATEGORIES: ${categories.length.toString().padStart(3)}                          │
│                                              │
└──────────────────────────────────────────────┘`}
        </pre>
      </div>

      <div className="metrics-panel">
        <pre className="metrics-content">
{`┌─[ DATABASE ACTIVITY ]───────────────────────┐
│                                              │
│ 100 │${'.'.repeat(10)}▄▄▄${'.'.repeat(23)}│
│     │${'.'.repeat(8)}▄▄█${' '.repeat(3)}█▄${'.'.repeat(21)}│
│  75 │${'.'.repeat(6)}▄█${' '.repeat(9)}█▄${'.'.repeat(19)}│
│     │${'.'.repeat(5)}█${' '.repeat(11)}█${'.'.repeat(19)}│
│  50 │${'.'.repeat(4)}█${' '.repeat(13)}█${'.'.repeat(18)}│
│     │${'█'.repeat(4)}${' '.repeat(15)}${'█'.repeat(18)}│
│   0 └────────────────────────────────────────│
│       0      25      50      75     100      │
│                                              │
│  QUERIES: ${(allCheats.length * 3).toString().padStart(4)}  │  LATENCY: 12ms           │
└──────────────────────────────────────────────┘`}
        </pre>
      </div>
    </div>
  );
}