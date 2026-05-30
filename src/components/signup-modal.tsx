"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowRight, Sparkles } from "lucide-react"

export function SignupModal() {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setOpen(false)
      alert("Welcome to the platform! This is a demo modal.")
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button size="lg" className="h-11 px-6 rounded-full font-semibold bg-violet-600 hover:bg-violet-500 text-white cursor-pointer shadow-lg hover:shadow-violet-500/20 active:translate-y-0.5 transition-all flex items-center gap-2">
          Get Started
          <ArrowRight className="w-4 h-4" />
        </Button>
      } />
      <DialogContent className="max-w-md w-[90vw] p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-1.5">
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-950/50 rounded-full flex items-center justify-center text-violet-600 dark:text-violet-400 mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create Your Account
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
            Enter your details below to start your 14-day free trial. No credit card required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Sarah Connor"
              required
              className="w-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-violet-500 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="sarah@example.com"
              required
              className="w-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-violet-500 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:border-violet-500 rounded-lg"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isLoading ? "Creating Account..." : "Start Free Trial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
