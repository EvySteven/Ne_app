import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BarChart3, BookOpen, Lightbulb, Bot, Calendar, User, Target, Sparkles } from 'lucide-react'

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: <BarChart3 className="w-4 h-4" /> },
  { name: 'Mon Journal', href: '/details', icon: <BookOpen className="w-4 h-4" /> },
  { name: 'Conseils', href: '/conseils', icon: <Lightbulb className="w-4 h-4" /> },
  { name: 'Chatbot', href: '/chatbot', icon: <Bot className="w-4 h-4" /> },
  { name: 'Calendrier', href: '/calendrier', icon: <Calendar className="w-4 h-4" /> },
  { name: 'Profil', href: '/profil', icon: <User className="w-4 h-4" /> },
  { name: 'Onboarding', href: '/onboarding', icon: <Target className="w-4 h-4" /> },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-[#C2185B]/20 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Sparkles className="w-6 h-6 text-[#C2185B]" />
          <span className="text-xl font-bold text-[#C2185B]">Né App</span>
        </div>

        <div className="flex items-center space-x-2">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className={pathname === item.href
                  ? "bg-[#C2185B] hover:bg-[#A0154A] text-white"
                  : "text-[#C2185B] hover:bg-[#C2185B]/10"
                }
              >
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}