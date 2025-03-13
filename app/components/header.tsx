import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export interface HeaderProps {
  title: string
  showBack?: boolean
  centerTitle?: boolean
  showBell?: boolean
  showLogo?: boolean
  leftComponent?: React.ReactNode
  rightComponent?: React.ReactNode
}

export default function Header({
  title,
  showBack = false,
  centerTitle = false,
  showBell = true,
  showLogo = true,
  leftComponent,
  rightComponent
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center">
          {showBack && (
            <Link href="/profile" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
          )}
          {leftComponent}
          <h1 className={`text-lg font-semibold ${centerTitle ? 'absolute left-1/2 -translate-x-1/2' : ''}`}>
            {title}
          </h1>
        </div>
        <div className="flex items-center">
          {rightComponent}
        </div>
      </div>
    </header>
  )
} 