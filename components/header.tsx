import React from "react"
import { Bell } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface HeaderProps {
  title?: string
  centerTitle?: boolean
  showBell?: boolean
  showLogo?: boolean
  leftComponent?: React.ReactNode
  rightComponent?: React.ReactNode
}

export default function Header({
  title,
  centerTitle = false,
  showBell = true,
  showLogo = true,
  leftComponent,
  rightComponent,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-2">
            {leftComponent}
            {showLogo && (
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold">星辰资本</span>
              </Link>
            )}
          </div>

          {title && (
            <div
              className={cn(
                "text-lg font-semibold",
                centerTitle && "absolute left-1/2 transform -translate-x-1/2"
              )}
            >
              {title}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {rightComponent}
            {showBell && (
              <Link href="/notifications" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  2
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

