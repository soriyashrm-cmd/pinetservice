"use client"

import * as React from "react"
import { BarChart3, Users, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardPreview() {
  return (
    <div className="w-full relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md p-6 shadow-2xl overflow-hidden group">
      {/* Decorative gradient overlay */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-700 pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono ml-2">app.apex.io/dashboard</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> Live
        </span>
      </div>

      {/* Main dashboard stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        {/* Monthly Revenue Card */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              $45,231
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +20.1% <span className="text-zinc-400 dark:text-zinc-500 font-normal">from last month</span>
            </p>
          </CardContent>
        </Card>

        {/* Active Users Card */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
              Active Users
            </CardTitle>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              +12,492
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +15.3% <span className="text-zinc-400 dark:text-zinc-500 font-normal">from last month</span>
            </p>
          </CardContent>
        </Card>

        {/* Conversion Rate Card */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
              Conversion Rate
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              4.82%
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.2% <span className="text-zinc-400 dark:text-zinc-500 font-normal">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Mock Analytics Chart */}
      <div className="mt-6 border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 rounded-xl p-4 shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Platform Performance</span>
          <div className="flex gap-4 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-600" /> Revenue</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-400" /> Visitors</span>
          </div>
        </div>

        {/* Visual Chart Bars */}
        <div className="flex items-end justify-between h-40 pt-6 px-2">
          {[
            { label: "Mon", rev: 40, vis: 60 },
            { label: "Tue", rev: 55, vis: 45 },
            { label: "Wed", rev: 85, vis: 90 },
            { label: "Thu", rev: 60, vis: 70 },
            { label: "Fri", rev: 95, vis: 80 },
            { label: "Sat", rev: 70, vis: 50 },
            { label: "Sun", rev: 90, vis: 100 },
          ].map((bar, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full flex items-end justify-center gap-1 max-w-[28px] h-28 relative">
                {/* Visitors bar */}
                <div
                  style={{ height: `${bar.vis}%` }}
                  className="w-2 rounded-full bg-indigo-300 dark:bg-indigo-950/50 hover:bg-indigo-400 transition-all duration-500"
                />
                {/* Revenue bar */}
                <div
                  style={{ height: `${bar.rev}%` }}
                  className="w-2 rounded-full bg-violet-600 hover:bg-violet-500 transition-all duration-500 shadow-[0_0_8px_rgba(124,58,237,0.3)]"
                />
              </div>
              <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
