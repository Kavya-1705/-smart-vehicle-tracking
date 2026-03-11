import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Trophy, 
  TrendingUp,
  TrendingDown,
  User,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { accidentsPerMonth, severityDistribution, dummyDrivers } from '@/data/dummyData';

function getSafetyScoreColor(score: number) {
  if (score >= 90) return 'text-emerald-400';
  if (score >= 80) return 'text-blue-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-red-400';
}

function getSafetyScoreBg(score: number) {
  if (score >= 90) return 'bg-emerald-500/20';
  if (score >= 80) return 'bg-blue-500/20';
  if (score >= 70) return 'bg-amber-500/20';
  return 'bg-red-500/20';
}

export function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');

  const sortedDrivers = [...dummyDrivers].sort((a, b) => b.safetyScore - a.safetyScore);

  const totalAccidents = accidentsPerMonth.reduce((acc, curr) => acc + curr.count, 0);
  const avgAccidents = Math.round(totalAccidents / 12);
  const maxMonth = accidentsPerMonth.reduce((max, curr) => curr.count > max.count ? curr : max);
  const minMonth = accidentsPerMonth.reduce((min, curr) => curr.count < min.count ? curr : min);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Fleet performance and safety insights</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalAccidents}</p>
                <p className="text-xs text-muted-foreground">Total Accidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgAccidents}</p>
                <p className="text-xs text-muted-foreground">Avg/Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{minMonth.count}</p>
                <p className="text-xs text-muted-foreground">Best Month ({minMonth.month})</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{maxMonth.count}</p>
                <p className="text-xs text-muted-foreground">Worst Month ({maxMonth.month})</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="severity" className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4" />
            Severity
          </TabsTrigger>
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Drivers
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Accidents Per Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accidentsPerMonth} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Severity Tab */}
        <TabsContent value="severity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-primary" />
                  Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {severityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry: any) => (
                          <span style={{ color: entry.color }}>{value}: {entry.payload.value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Severity Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {severityDistribution.map((item) => (
                    <div key={item.name} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium">{item.name} Severity</span>
                        </div>
                        <span className="text-2xl font-bold" style={{ color: item.color }}>
                          {item.value}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            backgroundColor: item.color,
                            width: `${(item.value / 10) * 100}%`
                          }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {((item.value / 10) * 100).toFixed(0)}% of total alerts
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Driver Safety Score Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedDrivers.map((driver, index) => (
                  <div 
                    key={driver.id} 
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 card-hover animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Rank */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                      ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                        index === 1 ? 'bg-slate-400/20 text-slate-400' : 
                        index === 2 ? 'bg-orange-600/20 text-orange-600' : 
                        'bg-muted text-muted-foreground'}
                    `}>
                      {index + 1}
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-muted-foreground">{driver.id}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium">{driver.trips}</p>
                        <p className="text-xs text-muted-foreground">Trips</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{(driver.distance / 1000).toFixed(1)}k</p>
                        <p className="text-xs text-muted-foreground">km</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-red-400">{driver.violations}</p>
                        <p className="text-xs text-muted-foreground">Violations</p>
                      </div>
                    </div>

                    {/* Safety Score */}
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-lg ${getSafetyScoreBg(driver.safetyScore)}`}>
                        <div className="flex items-center gap-2">
                          <Shield className={`w-4 h-4 ${getSafetyScoreColor(driver.safetyScore)}`} />
                          <span className={`font-bold text-lg ${getSafetyScoreColor(driver.safetyScore)}`}>
                            {driver.safetyScore}
                          </span>
                        </div>
                      </div>
                      {index < 3 && (
                        <Badge variant="outline" className={
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          index === 1 ? 'bg-slate-400/20 text-slate-400 border-slate-400/30' :
                          'bg-orange-600/20 text-orange-600 border-orange-600/30'
                        }>
                          <Trophy className="w-3 h-3 mr-1" />
                          Top {index + 1}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
