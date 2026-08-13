'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Phone, LogIn, UserPlus, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const getProfile = async (uid: string) => {
      const { data } = await supabase.from('profiles').select('role').eq('id', uid).single()
      setProfile(data)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) getProfile(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) getProfile(session.user.id)
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="bg-[#4c1d95] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="hidden sm:block">🇧🇩 বাংলাদেশের সহজ নাগরিক সেবা প্ল্যাটফর্ম</span>
          <div className="flex items-center gap-1 ml-auto">
            <Phone size={11} />
            <a href="tel:01880119330" className="hover:text-violet-300 transition-colors">01880119330</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#8b5cf6] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">ন</span>
            </div>
            <div>
              <div className="text-[#7c3aed] font-bold text-lg leading-tight">নাগরিক সেবা</div>
              <div className="text-gray-400 text-xs">Nagarik Sheba</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-[#7c3aed] font-medium transition-colors text-sm">হোম</Link>
            <Link href="/services" className="text-gray-700 hover:text-[#7c3aed] font-medium transition-colors text-sm">সেবাসমূহ</Link>
            <Link href="/about" className="text-gray-700 hover:text-[#7c3aed] font-medium transition-colors text-sm">আমাদের সম্পর্কে</Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#7c3aed] font-medium transition-colors text-sm">যোগাযোগ</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 transition-all shadow-md">
                    <ShieldCheck size={16} /> এডমিন প্যানেল
                  </Link>
                )}
                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg btn-primary text-white font-medium text-sm">
                  <LayoutDashboard size={16} /> ড্যাশবোর্ড
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-red-400 text-red-500 font-medium text-sm hover:bg-red-50 transition-all">
                  <LogOut size={16} /> লগআউট
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#7c3aed] text-[#7c3aed] font-medium text-sm hover:bg-violet-50 transition-all">
                  <LogIn size={16} /> লগইন
                </Link>
                <Link href="/auth/register" className="flex items-center gap-2 px-4 py-2 rounded-lg btn-primary text-white font-medium text-sm">
                  <UserPlus size={16} /> রেজিস্ট্রেশন
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mobile-menu bg-white border-t border-gray-100 px-4 py-4 space-y-2 shadow-lg">
          <Link href="/" className="block text-gray-700 py-2 border-b border-gray-50 font-medium" onClick={() => setIsOpen(false)}>🏠 হোম</Link>
          <Link href="/services" className="block text-gray-700 py-2 border-b border-gray-50 font-medium" onClick={() => setIsOpen(false)}>⚡ সেবাসমূহ</Link>
          <Link href="/about" className="block text-gray-700 py-2 border-b border-gray-50 font-medium" onClick={() => setIsOpen(false)}>ℹ️ আমাদের সম্পর্কে</Link>
          <Link href="/contact" className="block text-gray-700 py-2 border-b border-gray-50 font-medium" onClick={() => setIsOpen(false)}>📞 যোগাযোগ</Link>
          <div className="flex gap-3 pt-2">
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link href="/admin" className="flex-1 text-center py-2.5 rounded-lg bg-amber-500 text-white font-medium text-sm" onClick={() => setIsOpen(false)}>এডমিন প্যানেল</Link>
                )}
                <Link href="/dashboard" className="flex-1 text-center py-2.5 rounded-lg btn-primary text-white font-medium text-sm" onClick={() => setIsOpen(false)}>ড্যাশবোর্ড</Link>
                <button onClick={handleLogout} className="flex-1 text-center py-2.5 rounded-lg border border-red-400 text-red-500 font-medium text-sm">লগআউট</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="flex-1 text-center py-2.5 rounded-lg border-2 border-[#7c3aed] text-[#7c3aed] font-medium text-sm" onClick={() => setIsOpen(false)}>লগইন</Link>
                <Link href="/auth/register" className="flex-1 text-center py-2.5 rounded-lg btn-primary text-white font-medium text-sm" onClick={() => setIsOpen(false)}>রেজিস্ট্রেশন</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
