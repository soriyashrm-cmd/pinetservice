"use client"

import * as React from "react"
import { Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function PricingCalculator() {
  const [isAnnual, setIsAnnual] = React.useState(true)
  const [users, setUsers] = React.useState(10)

  const basePricePerUser = 12 // monthly price per user
  const discountMultiplier = isAnnual ? 0.8 : 1 // 20% discount for annual
  const monthlyCost = Math.round(users * basePricePerUser * discountMultiplier)
  const annualCost = monthlyCost * 12

  return (
    <Card className="w-full max-w-xl mx-auto border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Flexible, Scale-with-You Pricing
        </CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400">
          Slide to choose your team size and see how much you save.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Toggle (Monthly / Annual) */}
        <div className="flex justify-center items-center gap-3">
          <span className={`text-sm font-medium transition-colors duration-200 ${!isAnnual ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 transition-colors duration-200 cursor-pointer relative"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-4 h-4 bg-violet-600 dark:bg-violet-400 rounded-full transition-transform duration-200 transform ${
                isAnnual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${isAnnual ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-400"}`}>
            Yearly
            <span className="text-[10px] bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full font-semibold">
              Save 20%
            </span>
          </span>
        </div>

        {/* User Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Team Size:</span>
            <span className="text-lg font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 px-3 py-0.5 rounded-md">
              {users} {users === 1 ? "User" : "Users"}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="100"
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-600 dark:accent-violet-400"
          />

          <div className="flex justify-between text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
            <span>1 User</span>
            <span>50 Users</span>
            <span>100 Users</span>
          </div>
        </div>

        {/* Price Output */}
        <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6 text-center space-y-2">
          <div className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">
            Estimated Cost
          </div>
          <div className="flex justify-center items-baseline gap-1">
            <span className="text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
              ${monthlyCost}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">/ month</span>
          </div>
          {isAnnual && (
            <div className="text-[12px] text-violet-600 dark:text-violet-400 font-semibold">
              Billed annually (${annualCost}/year)
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-3 pt-0">
        <ul className="w-full text-xs space-y-2 text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-900/60 pt-4">
          <li className="flex items-center gap-2">
            <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            <span>Includes all premium SaaS platform features</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            <span>24/7 dedicated engineering support and SLA</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            <span>GDPR, HIPAA, and SOC2 compliant hosting</span>
          </li>
        </ul>
      </CardFooter>
    </Card>
  )
}
