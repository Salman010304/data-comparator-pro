import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface StudentData {
  uid: string;
  name: string;
  maxLevel: number;
  stars: number;
  testScores: Record<number, { score: number; total: number; date: number }>;
  gameScores: Record<string, { score: number; date: number }>;
}

interface ProgressChartProps {
  students: StudentData[];
  selectedStudent?: StudentData | null;
}

const COLORS = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

export const ProgressChart = ({ students, selectedStudent }: ProgressChartProps) => {
  // Level distribution data
  const levelDistribution = Array.from({ length: 8 }, (_, i) => ({
    level: `Level ${i + 1}`,
    students: students.filter(s => s.maxLevel === i + 1).length,
  }));

  // Stars distribution
  const starsData = students.map(s => ({
    name: s.name.split(' ')[0],
    stars: s.stars,
  })).slice(0, 10);

  // Test performance for selected student
  const testPerformance = selectedStudent
    ? Object.entries(selectedStudent.testScores || {}).map(([level, data]) => ({
        level: `L${level}`,
        score: ((data.score / data.total) * 100).toFixed(0),
        percentage: (data.score / data.total) * 100,
      }))
    : [];

  // Game scores pie chart
  const gameScoresPie = selectedStudent
    ? Object.entries(selectedStudent.gameScores || {}).map(([game, data], index) => ({
        name: game.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: data.score,
        color: COLORS[index % COLORS.length],
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Overall Class Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h4 className="font-bold text-foreground mb-4">📊 Level Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={levelDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="level" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="students" fill="hsl(238, 65%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h4 className="font-bold text-foreground mb-4">⭐ Top Stars</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={starsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} width={60} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="stars" fill="hsl(45, 100%, 55%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Student Charts */}
      {selectedStudent && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h4 className="font-bold text-foreground mb-4">📝 {selectedStudent.name}'s Test Performance</h4>
            {testPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={testPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="level" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => [`${value}%`, 'Score']}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="hsl(145, 65%, 45%)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(145, 65%, 45%)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No test data yet
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h4 className="font-bold text-foreground mb-4">🎮 {selectedStudent.name}'s Game Scores</h4>
            {gameScoresPie.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={gameScoresPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {gameScoresPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No game data yet
              </div>
            )}
            {gameScoresPie.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {gameScoresPie.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded" style={{ background: entry.color }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
