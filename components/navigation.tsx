import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: '📊' },
  { name: 'Mon Journal', href: '/details', icon: '📔' },
  { name: 'Conseils', href: '/conseils', icon: '💡' },
  { name: 'Chatbot', href: '/chatbot', icon: '🤖' },
  { name: 'Calendrier', href: '/calendrier', icon: '📅' },
  { name: 'Profil', href: '/profil', icon: '👤' },
  { name: 'Onboarding', href: '/onboarding', icon: '🎯' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-[#C2185B]/20 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="text-2xl">🌸</span>
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