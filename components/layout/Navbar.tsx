'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Phone, LogIn, UserPlus, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// অফিসিয়াল WhatsApp লিঙ্ক
const WHATSAPP_LINK = "https://wa.me/message/5GS3DHNNX6PSM1"

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
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1">
              <Phone size={11} />
              <a href="tel:01602797394" className="hover:text-violet-300 transition-colors">01602797394</a>
            </div>
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

          <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
            {/* 🟢 HEADER WHATSAPP BUTTON */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#00c853] hover:bg-[#00b34a] active:scale-95 text-white font-bold text-xs rounded-full shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
              title="WhatsApp এ সরাসরি মেসেজ দিন"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="text-white group-hover:rotate-12 transition-transform shrink-0"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp এ মেসেজ দিন</span>
            </a>

            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-all shadow-sm">
                    <ShieldCheck size={14} /> এডমিন
                  </Link>
                )}
                <Link href="/dashboard" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7c3aed] text-white font-bold text-xs hover:bg-violet-700 transition shadow-sm">
                  <LayoutDashboard size={14} /> ড্যাশবোর্ড
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-300 text-red-500 font-bold text-xs hover:bg-red-50 transition">
                  <LogOut size={14} /> লগআউট
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#7c3aed] text-[#7c3aed] font-bold text-xs hover:bg-violet-50 transition">
                  <LogIn size={14} /> লগইন
                </Link>
                <Link href="/auth/register" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7c3aed] text-white font-bold text-xs hover:bg-violet-700 transition shadow-sm">
                  <UserPlus size={14} /> রেজিস্ট্রেশন
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
          {/* Mobile WhatsApp Button */}
          <a
            href="https://wa.me/message/22ICZ7SXLLUTK1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 mb-2 bg-[#00c853] text-white font-bold text-xs rounded-xl shadow-sm"
          >
            <span>WhatsApp এ মেসেজ দিন</span>
          </a>

          <Link href="/" className="block text-gray-700 py-2 border-b border-gray-50 font-medium" onClick={() => setIsOpen(false)}>🏠 হোম</Link>
          <Link href="/services" className="block text-gray-700 py-2 border-b border-gray-50 font-medium" onClick={() => setIsOpen(false)}>⚡ সেবাসমূহ</Link>
          <Link href="/about" className="block text-gray-700 py-2 border-b border-gray-50 font-medium" onClick={() => setIsOpen(false)}>ℹ️ আমাদের সম্পর্কে</Link>
          <Link href="/contact" className="block text-gray-700 py-2 border-b border-gray-50 font-medium" onClick={() => setIsOpen(false)}>📞 যোগাযোগ</Link>
          
          <div className="flex gap-2 pt-2">
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link href="/admin" className="flex-1 text-center py-2.5 rounded-lg bg-amber-500 text-white font-bold text-xs" onClick={() => setIsOpen(false)}>এডমিন</Link>
                )}
                <Link href="/dashboard" className="flex-1 text-center py-2.5 rounded-lg bg-[#7c3aed] text-white font-bold text-xs" onClick={() => setIsOpen(false)}>ড্যাশবোর্ড</Link>
                <button onClick={handleLogout} className="flex-1 text-center py-2.5 rounded-lg border border-red-400 text-red-500 font-bold text-xs">লগআউট</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="flex-1 text-center py-2.5 rounded-lg border border-[#7c3aed] text-[#7c3aed] font-bold text-xs" onClick={() => setIsOpen(false)}>লগইন</Link>
                <Link href="/auth/register" className="flex-1 text-center py-2.5 rounded-lg bg-[#7c3aed] text-white font-bold text-xs" onClick={() => setIsOpen(false)}>রেজিস্ট্রেশন</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}