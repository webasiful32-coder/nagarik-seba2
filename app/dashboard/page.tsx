'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Menu, X, LogOut, User, Search, Bell,
  Wallet, Settings, Clock, Send, ShieldCheck, ArrowDownToLine,
  CreditCard, Sparkles, ArrowRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import { categories } from '@/lib/services'

const WHATSAPP_LINK = "https://wa.me/message/5GS3DHNNX6PSM1"

export default function DashboardPage() {
  const router = useRouter()
  const [services, setServices] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // সেবা অর্ডার উইন্ডো
  const [activeService, setActiveService] = useState<any | null>(null)
  const [orderInput, setOrderInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // রিচার্জ প্রয়োজন নোটিফিকেশন টোস্ট
  const [toast, setToast] = useState<{ title: string; message: string; show: boolean } | null>(null)

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // সার্ভিস লোড
      const { data: servicesData } = await supabase.from('services').select('*').order('created_at', { ascending: true })
      setServices(servicesData || [])

      // সেশন চেক
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('bd_portal_user') : null
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(profileData || { full_name: 'asifulcse', balance: 0 } as any)
      } else if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser)
          setProfile(parsed)
        } catch (e) {
          router.replace('/')
          return
        }
      } else {
        // লগইন ছাড়া কেউ ড্যাশবোর্ডে ঢুকলে সরাসরি ১ম পেজে পাঠিয়ে দেবে
        router.replace('/')
        return
      }

      setLoading(false)
    }

    checkAuthAndFetch()
  }, [router])

  const triggerToast = (title: string, message: string) => {
    setToast({ title, message, show: true })
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, show: false } : null)
    }, 4500)
  }

  // 🎯 সেবা ওপেন হওয়ার শর্ত: ইউজার যখন রিচার্জ করবে তখনই ওপেন হবে!
  const handleServiceClick = (service: any) => {
    const currentBalance = profile?.balance || 0
    
    // ব্যালেন্স পর্যাপ্ত না থাকলে সেবা ওপেন হবে না — রিচার্জ করতে বলবে
    if (currentBalance < service.price) {
      triggerToast(
        '⚠️ ব্যালেন্স রিচার্জ প্রয়োজন',
        `"${service.title}" সেবার জন্য ৳ ${service.price} ফি প্রয়োজন। আপনার বর্তমান ব্যালেন্স ৳ ${currentBalance}। সেবাটি চালু করতে অনুগ্রহ করে ব্যালেন্স রিচার্জ করুন।`
      )
      return
    }

    // ব্যালেন্স রিচার্জ করা থাকলে সাথে সাথে সেবা ওপেন হবে
    setActiveService(service)
    setOrderInput('')
  }

  // অর্ডার সম্পন্ন লজিক
  const handlePlaceOrder = async (service: any) => {
    if (!orderInput.trim()) return alert('অনুগ্রহ করে প্রয়োজনীয় তথ্য দিন!')

    setSubmitting(true)
    const { data, error: rpcError } = await supabase.rpc('place_order', {
      p_service_id: service.id,
      p_service_name: service.title,
      p_price: service.price,
      p_input_data: orderInput.trim(),
    })

    if (rpcError || (data && !data.success)) {
      alert(rpcError?.message || data?.message || 'অর্ডার করতে সমস্যা হয়েছে।')
    } else {
      alert('✅ আপনার সেবা অর্ডার সফল হয়েছে!')
      setActiveService(null)
      setOrderInput('')
      setProfile(prev => {
        const updated = prev ? { ...prev, balance: (prev.balance || 0) - service.price } : null
        if (updated) localStorage.setItem('bd_portal_user', JSON.stringify(updated))
        return updated
      })
    }
    setSubmitting(false)
  }

  // 🚪 লগআউট করলে সরাসরি ১ম ল্যান্ডিং পেজে পাঠিয়ে দেওয়া হবে
  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('bd_portal_user')
    router.replace('/')
  }

  const filteredServices = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.title_en && s.title_en.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchCat && matchSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0edff]">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[#7c3aed] font-bold">ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'ড্যাশবোর্ড' },
    { href: '/dashboard/profile', icon: User, label: 'প্রোফাইল' },
    { href: '/dashboard/orders', icon: Clock, label: 'অর্ডার লিস্ট' },
    { href: '/dashboard/balance', icon: Wallet, label: 'ব্যালেন্স যোগ করুন' },
    { href: '/dashboard/withdraw', icon: ArrowDownToLine, label: 'উইথড্র করুন' },
    { href: '/dashboard/settings', icon: Settings, label: 'সেটিংস' },
  ]

  return (
    <div className="min-h-screen flex bg-[#f3f0ff] font-sans antialiased relative">

      {/* 🔔 রিচার্জ প্রয়োজন নোটিফিকেশন */}
      {toast && toast.show && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-white border-2 border-amber-400 shadow-2xl flex items-start gap-3.5 w-84 sm:w-96 animate-fade-in">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 border border-amber-200">
            <CreditCard size={18} />
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-black text-slate-900">{toast.title}</h5>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-semibold">{toast.message}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push('/dashboard/balance')}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-bold text-[11px] shadow-sm cursor-pointer"
              >
                এখনই রিচার্জ করুন
              </button>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="px-2 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-semibold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── সাইডবার ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-r from-purple-700 to-indigo-800 flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/dashboard" className="text-white font-black text-xl tracking-tight">
            নাগরিক সেবা
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* ব্যালেন্স কার্ড */}
        <div className="px-4 py-5">
          <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-3xl p-5 text-center text-slate-950 shadow-lg border border-amber-300/40">
            <p className="text-xs font-black mb-1.5 uppercase tracking-wider text-slate-900">
              বর্তমান ব্যালেন্স
            </p>
            <p className="text-3xl font-black mb-4 text-slate-950 font-mono">
              {profile?.balance || 0} ৳
            </p>
            <button
              onClick={() => router.push('/dashboard/balance')}
              className="block text-center w-full bg-white text-orange-600 py-2.5 rounded-xl text-xs sm:text-sm font-black hover:bg-orange-50 transition shadow-sm cursor-pointer"
            >
              রিচার্জ করুন
            </button>
          </div>
        </div>

        {/* নেভিগেশন মেনু */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                if (item.href === '/dashboard') {
                  setActiveService(null)
                  return
                }
                router.push(item.href)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-purple-100 hover:text-white hover:bg-white/10 transition text-left cursor-pointer"
            >
              <item.icon size={18} className="text-purple-300" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* লগআউট বাটন */}
        <div className="px-3 py-4 border-t border-white/10">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-300 hover:text-white hover:bg-rose-600/30 transition font-bold text-sm cursor-pointer"
          >
            <LogOut size={18} /> লগআউট
          </button>
        </div>
      </aside>

      {/* ── মূল ড্যাশবোর্ড বডি ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* হেডার বার */}
        <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-30 h-[68px] flex items-center px-4 sm:px-6 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer">
            <Menu size={22} />
          </button>
          
          <div className="flex-1 relative max-w-md hidden sm:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="সেবা খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-purple-50/40 border border-purple-100/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-900"
            />
          </div>

          <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#00c853] hover:bg-[#00b34a] text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp এ মেসেজ দিন</span>
            </a>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-black text-slate-800 leading-tight">{profile?.full_name}</p>
                <p className="text-[10px] text-purple-700 font-bold font-mono mt-0.5">ব্যালেন্স: {profile?.balance || 0}৳</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-md uppercase">
                {profile?.full_name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* ড্যাশবোর্ড মেইন পেজ */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">

          {/* 🟣 পার্পল ব্যানার */}
          <div className="relative bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#9333ea] rounded-3xl p-6 sm:p-9 text-white overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-black mb-1.5 leading-tight flex items-center gap-2">
                আস্সালামু আলাইকুম, {profile?.full_name}! 👋
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm mb-5 font-semibold">
                আজকে আপনি কোন সরকারি সেবাটি নিতে চান?
              </p>
              
              <button
                onClick={() => router.push('/dashboard/balance')}
                className="inline-flex items-center gap-2 bg-white text-purple-900 px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md hover:bg-purple-50 transition cursor-pointer"
              >
                <Wallet size={16} className="text-purple-700" />
                <span>ব্যালেন্স যোগ করুন</span>
              </button>
            </div>
          </div>

          {/* ক্যাটাগরি বাটনসমূহ */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                    isActive
                      ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:text-purple-700'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* সার্ভিস কার্ড গ্রিড */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {filteredServices.map(service => {
              const currentBalance = profile?.balance || 0
              const needsRecharge = currentBalance < service.price

              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-purple-50/40 rounded-3xl p-5 flex flex-col items-center text-center border border-purple-100/70 shadow-sm hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition group cursor-pointer"
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 ${service.color || 'bg-purple-50 text-purple-600'} rounded-2xl flex items-center justify-center text-3xl mb-3.5 group-hover:scale-110 transition shadow-xs`}>
                    {service.icon}
                  </div>
                  <p className="text-xs sm:text-sm font-black text-slate-800 leading-snug mb-3 line-clamp-2">
                    {service.title}
                  </p>
                  
                  <div className="inline-flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[11px] font-black border border-purple-200/60 font-mono">
                    ৳ {service.price}
                  </div>

                  <div className="mt-3 pt-2 border-t border-purple-50 w-full text-[10px] font-bold">
                    {needsRecharge ? (
                      <span className="text-amber-600 font-bold">রিচার্জ লাগবে →</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">সেবা নিন →</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </main>
      </div>

      {/* সেবা অর্ডার উইন্ডো (রিচার্জ করার পর সেবা নেওয়ার জন্য) */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => setActiveService(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-purple-100" onClick={e => e.stopPropagation()}>
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-14 h-14 rounded-2xl ${activeService.color || 'bg-purple-50 text-purple-600'} flex items-center justify-center text-3xl shadow-sm border border-purple-100 shrink-0`}>
                  {activeService.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">{activeService.title}</h3>
                  <p className="text-[#7c3aed] font-black text-xs sm:text-sm font-mono mt-0.5">চার্জ: {activeService.price} ৳</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[11px] font-bold text-gray-400 mb-2">
                  {activeService.inputLabel || 'প্রয়োজনীয় তথ্য (NID / ফরম নম্বর)'}
                </label>
                <input
                  type="text"
                  value={orderInput}
                  onChange={e => setOrderInput(e.target.value)}
                  placeholder={activeService.inputPlaceholder || 'এখানে লিখুন...'}
                  className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setActiveService(null)} className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold text-gray-600 text-xs sm:text-sm transition cursor-pointer">
                  বাতিল
                </button>
                <button onClick={() => handlePlaceOrder(activeService)} disabled={submitting} className="flex-1 py-3.5 bg-[#7c3aed] hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg text-xs sm:text-sm transition cursor-pointer disabled:opacity-50">
                  {submitting ? 'লোড হচ্ছে...' : <><Send size={15} /><span>অর্ডার করুন</span></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}