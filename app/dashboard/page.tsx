'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Menu, X, LogOut, User, Search, Bell,
  Wallet, Settings, Clock, Send, LogIn, UserPlus, ShieldCheck, ArrowDownToLine
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import { services, categories } from '@/lib/services'

export default function DashboardPage() {
  const router = useRouter()
  const [services, setServices] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeService, setActiveService] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [trxId, setTrxId] = useState('')
  const [method, setMethod] = useState('bKash')
  const [orderInput, setOrderInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      // Fetch services first (available to all)
      const { data: servicesData } = await supabase.from('services').select('*').order('created_at', { ascending: true })
      setServices(servicesData || [])

      if (!session) {
        router.push('/')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      const fullName = profileData?.full_name || session.user.user_metadata?.full_name || 'User'
      setProfile({ ...profileData, full_name: fullName })
      setIsGuest(false)
      setLoading(false)
    }
    getData()
  }, [router])

  const handleAddBalance = async () => {
    if (!depositAmount || !trxId) return alert('টাকার পরিমাণ এবং TrxID দিন')
    setSubmitting(true)
    const { data, error } = await supabase.rpc('auto_approve_recharge', {
      p_amount: Number(depositAmount),
      p_trx_id: trxId.trim().toUpperCase(),
      p_method: method,
      p_description: `Quick recharge via ${method}`,
      p_account_type: 'Personal',
    })
    setSubmitting(false)
    if (error || (data && !data.success)) {
      alert(data?.message || error?.message || 'এই TrxID টি আগে ব্যবহার হয়েছে অথবা ভুল!')
    } else {
      alert('✅ ব্যালেন্স সফলভাবে যোগ হয়েছে!')
      setPaymentModalOpen(false)
      setTrxId('')
      setDepositAmount('')
      window.location.reload()
    }
  }

  const handlePlaceOrder = async (service: any) => {
    if (!orderInput) return alert('প্রয়োজনীয় তথ্য (NID/নাম্বার) দিন')
    if ((profile?.balance || 0) < service.price) {
      alert('আপনার পর্যাপ্ত ব্যালেন্স নেই! ব্যালেন্স যোগ করার পেজে নিয়ে যাওয়া হচ্ছে।')
      router.push('/dashboard/balance')
      return
    }
    setSubmitting(true)
    const { data, error: rpcError } = await supabase.rpc('place_order', {
      p_service_id: service.id,
      p_service_name: service.title,
      p_price: service.price,
      p_input_data: orderInput,
    })
    if (rpcError || (data && !data.success)) {
      alert(rpcError?.message || data?.message || 'অর্ডার করতে সমস্যা হয়েছে।')
    } else {
      alert('অর্ডার সফল হয়েছে!')
      setActiveService(null)
      setOrderInput('')
      window.location.reload()
    }
    setSubmitting(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
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
          <p className="text-[#7c3aed] font-bold">লোড হচ্ছে...</p>
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
    <div className="min-h-screen flex bg-[#f3f0ff]">

      {/* ── SIDEBAR ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-r from-purple-600 to-indigo-700  flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <Link href="/" className="text-white font-black text-base leading-tight">
            নাগরিক সেবা
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-black/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Balance card */}
        <div className="px-4 py-4">
          {isGuest ? (
            <div className="bg-gradient-to-br from-violet-700 to-violet-500 rounded-2xl p-4 text-white space-y-2 shadow-lg">
              <p className="text-xs text-white/70 text-center">সেবা নিতে লগিন করুন</p>
              <Link href="/auth/login" className="w-full bg-white text-violet-800 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5">
                <LogIn size={13} /> লগিন
              </Link>
              <Link href="/auth/register" className="w-full bg-violet-600 border border-white/20 text-white py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5">
                <UserPlus size={13} /> রেজিস্ট্রেশন
              </Link>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 
                rounded-2xl p-6 text-center text-white 
                shadow-lg hover:shadow-xl transition-all duration-300">
              <p className="text-xs text-violet-100 font-medium mb-1 tracking-wide">
                বর্তমান ব্যালেন্স
              </p>
              <p className="text-3xl font-extrabold mb-4 drop-shadow-sm text-black">
                {profile?.balance || 0} ৳
              </p>
              <Link
                href="/dashboard/balance"
                className="block text-center w-full bg-white text-orange-600 
               py-2 rounded-xl text-sm font-bold 
               hover:bg-orange-50 hover:text-orange-700 
               transition-colors shadow-sm"
              >
                রিচার্জ করুন
              </Link>
            </div>


          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:text-cyan-300 hover:bg-indigo-700/40 transition-all text-sm font-medium group"
            >
              <item.icon size={17} className="group-hover:text-violet-300 transition-colors" />
              {item.label}
            </Link>
          ))}
          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-400 hover:bg-amber-500/10 transition-all text-sm font-bold border border-amber-500/20 mt-2"
            >
              <ShieldCheck size={17} /> এডমিন প্যানেল
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          {isGuest ? (
            <Link href="/auth/login" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-violet-300 hover:bg-violet-700/30 transition text-sm">
              <LogIn size={17} /> লগিন / রেজিস্ট্রেশন
            </Link>
          ) : (
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 
               hover:text-white 
               hover:bg-rose-600/30    transition-colors duration-300 font-semibold">
              <LogOut size={17} /> লগআউট
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 h-[60px] flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition">
            <Menu size={20} />
          </button>
          <div className="flex-1 relative max-w-sm hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="সেবা খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition">
              <Bell size={17} />
            </button>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-gray-800 leading-none">{profile?.full_name}</p>
              <p className="text-[10px] text-violet-600 font-medium mt-0.5">ব্যালেন্স: {profile?.balance || 0}৳</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-black text-sm shadow-md">
              {profile?.full_name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">

          {/* ── WELCOME BANNER ── */}
          <div className="relative bg-gradient-to-r from-[#3b0d8c] via-[#7c3aed] to-[#a855f7] rounded-3xl p-6 sm:p-8 mb-6 text-white overflow-hidden shadow-[0_10px_40px_rgba(124,58,237,0.35)]">
            {/* decorative circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-20 w-24 h-24 bg-fuchsia-400/20 rounded-full blur-xl" />

            {/* Credit card decorative on right */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 opacity-30">
              <div className="w-24 h-14 rounded-xl bg-white/20 backdrop-blur border border-white/30 shadow-inner" />
              <div className="w-20 h-10 rounded-lg bg-white/15 backdrop-blur border border-white/20 shadow-inner self-end" />
            </div>

            <div className="relative z-10 max-w-md">
              {isGuest ? (
                <>
                  <h2 className="text-2xl sm:text-3xl font-black mb-1 leading-tight">
                    নাগরিক সেবায় স্বাগতম! 👋
                  </h2>
                  <p className="text-violet-100 text-sm mb-5 font-medium">
                    সেবা নিতে লগিন বা ফ্রি রেজিস্ট্রেশন করুন
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-[#3b0d8c] px-6 py-2.5 rounded-2xl font-black text-sm shadow-lg hover:-translate-y-0.5 transition-all">
                      <UserPlus size={15} /> বিনামূল্যে যোগ দিন
                    </Link>
                    <Link href="/auth/login" className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-white/25 transition-all">
                      <LogIn size={15} /> লগিন
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl sm:text-3xl font-black mb-1 leading-tight">
                    আস্সালামু আলাইকুম, {profile?.full_name?.split(' ')[0]}! 👋
                  </h2>
                  <p className="text-violet-100 text-sm mb-5 font-medium">
                    আজকে আপনি কোন সরকারি সেবাটি নিতে চান?
                  </p>
                  <Link
                    href="/dashboard/balance"
                    className="inline-flex items-center gap-2 bg-white text-[#3b0d8c] px-6 py-2.5 rounded-2xl font-black text-sm shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <Wallet size={15} /> ব্যালেন্স যোগ করুন
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ── CATEGORIES ── */}
          <div className="flex gap-2.5 overflow-x-auto pb-3 no-scrollbar mb-5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${activeCategory === cat.id
                  ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-[0_4px_12px_rgba(124,58,237,0.35)]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-600'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── SERVICE GRID (2-col on mobile, more on desktop, matching the app screenshot) ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredServices.map(service => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className="bg-gradient-to-r from-violet-50 to-pink-100 
                rounded-3xl p-5 flex flex-col items-center text-center 
                border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.05)] 
                hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] 
                hover:border-violet-200 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                  {service.icon}
                </div>
                <p className="text-sm font-bold text-gray-800 leading-snug mb-3 line-clamp-2">{service.title}</p>
                <div className="inline-flex items-center bg-violet-50 text-[#7c3aed] px-3 py-1.5 rounded-full text-[11px] font-black border border-violet-100">
                  ৳ {service.price}
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* ── RECHARGE MODAL ── */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-black mb-5 flex items-center gap-2 text-gray-800">
              <Wallet className="text-violet-600" size={22} /> রিচার্জ করুন
            </h3>
            <div className="bg-violet-50 p-4 rounded-2xl mb-5 border border-violet-100">
              <p className="text-[10px] text-violet-500 font-bold uppercase tracking-wider mb-1">বিকাশ/নগদ (পার্সোনাল)</p>
              <p className="text-lg font-black text-violet-700 tracking-widest">017XXXXXXXX</p>
              <p className="text-[10px] text-violet-500 mt-1">সেন্ড মানি করার পর ট্রানজেকশন আইডি দিন</p>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                {['bKash', 'Nagad'].map(m => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${method === m ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-gray-100 text-gray-400'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <input type="number" placeholder="টাকার পরিমাণ" className="w-full p-3.5 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:ring-2 focus:ring-violet-400 text-sm" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />
              <input type="text" placeholder="Transaction ID (TrxID)" className="w-full p-3.5 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:ring-2 focus:ring-violet-400 text-sm" value={trxId} onChange={e => setTrxId(e.target.value)} />
              <div className="flex gap-3 pt-1">
                <button onClick={() => setPaymentModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 rounded-2xl font-bold text-gray-500 text-sm hover:bg-gray-200 transition">বাতিল</button>
                <button onClick={handleAddBalance} disabled={submitting} className="flex-1 py-3.5 bg-[#7c3aed] text-white rounded-2xl font-bold shadow-lg shadow-violet-200 text-sm hover:bg-violet-700 transition">
                  {submitting ? 'প্রসেসিং...' : 'সাবমিট করুন'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ORDER MODAL ── */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setActiveService(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            {(() => {
              const s = services.find(sv => sv.id === activeService)
              if (!s) return null

              if (isGuest) return (
                <>
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-3xl shadow-md`}>{s.icon}</div>
                    <div>
                      <h3 className="text-lg font-black text-gray-800">{s.title}</h3>
                      <p className="text-violet-600 font-bold text-sm">চার্জ: {s.price} ৳</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-center">
                    <p className="text-amber-700 font-black mb-1">🔒 লগিন প্রয়োজন</p>
                    <p className="text-amber-600 text-sm">এই সেবা নিতে লগিন করুন বা ফ্রি আকাউন্ট বানান</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setActiveService(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500 text-sm hover:bg-gray-200 transition">বাতিল</button>
                    <Link href="/auth/login" className="flex-1 py-4 bg-[#7c3aed] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg text-sm hover:bg-violet-700 transition">
                      <LogIn size={17} /> লগিন
                    </Link>
                  </div>
                </>
              )

              return (
                <>
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-3xl shadow-md`}>{s.icon}</div>
                    <div>
                      <h3 className="text-lg font-black text-gray-800">{s.title}</h3>
                      <p className="text-violet-600 font-bold text-sm">চার্জ: {s.price} ৳</p>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{s.inputLabel || 'প্রয়োজনীয় তথ্য'}</label>
                    <input
                      type="text"
                      value={orderInput}
                      onChange={e => setOrderInput(e.target.value)}
                      placeholder={s.inputPlaceholder || 'এখানে লিখুন...'}
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:ring-2 focus:ring-violet-400 text-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setActiveService(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500 text-sm hover:bg-gray-200 transition">বাতিল</button>
                    <button onClick={() => handlePlaceOrder(s)} disabled={submitting} className="flex-1 py-4 bg-[#7c3aed] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-200 text-sm hover:bg-violet-700 transition">
                      {submitting ? 'লোড হচ্ছে...' : <><Send size={16} /> অর্ডার করুন</>}
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}