'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Home, Compass, MessageSquare, Heart, Tag, 
  LayoutGrid, User, Settings, Plus 
} from 'lucide-react'

interface DashboardSidebarProps {
  activeTab: string
}

export function DashboardSidebar({ activeTab }: DashboardSidebarProps) {
  const { user } = useAuth()
  const router = useRouter()
  
  const links = [
    { icon: Home, label: 'Home', id: 'home', href: '/marketplace' },
    { icon: Compass, label: 'Explore', id: 'explore', href: '/marketplace' },
    { icon: MessageSquare, label: 'Messages', id: 'messages', href: '/chat' },
    { icon: Heart, label: 'Saved Items', id: 'saved', href: '/dashboard?tab=saved' },
    { icon: Tag, label: 'My Listings', id: 'listings', href: '/dashboard?tab=listings' },
    { icon: LayoutGrid, label: 'Categories', id: 'categories', href: '/marketplace?category=all' },
    { icon: User, label: 'Profile', id: 'profile', href: '/dashboard?tab=profile' },
    { icon: Settings, label: 'Settings', id: 'settings', href: '/dashboard?tab=settings' },
  ]

  return (
    <aside className="w-72 h-[calc(100vh-2rem)] sticky top-4 hidden lg:flex flex-col p-6 rounded-[2.5rem] bg-white border border-border shadow-2xl shadow-black/[0.03] z-40">
      <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => router.push('/')}>
        <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">
          U
        </div>
        <span className="text-xl font-black tracking-tight text-foreground">UrbanTrade</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-hide">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
              activeTab === link.id 
                ? "bg-primary/5 text-primary font-bold" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <link.icon className={cn("h-5 w-5 transition-colors", activeTab === link.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
            <span className="text-sm">{link.label}</span>
            {activeTab === link.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border/50">
        <Button 
          onClick={() => router.push('/sell')}
          className="w-full h-14 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
        >
          <Plus className="h-5 w-5" />
          Sell Item
        </Button>
      </div>
    </aside>
  )
}
