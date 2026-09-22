'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Menu, X, LogOut, User, Search,
  Wallet, Settings, Clock, Send, ShieldCheck, ArrowDownToLine,
  CreditCard, Sparkles, ArrowRight, ArrowLeft, UserCheck, Eye, EyeOff, Lock, Phone,
  Upload, Image as ImageIcon, Baby, CheckCircle2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import { categories, services as staticServices } from '@/lib/services'

const WHATSAPP_LINK = "https://wa.me/message/22ICZ7SXLLUTK1"

export default function DashboardPage() {
  const router = useRouter()
  const [services, setServices] = useState<any[]>(staticServices)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // ইউজার ও প্রোফাইল স্টেট
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(true)

  // রেজিস্ট্রেশন ও লগইন মোডাল
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register')
  const [authForm, setAuthForm] = useState({ name: '', phone: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  // সেবা অর্ডার উইন্ডো
  const [activeService, setActiveService] = useState<any | null>(null)
  const [orderInput, setOrderInput] = useState('')
  
  // আইডি কার্ড সংশোধিত তথ্য চাহিদা ও ছবি জমা দেওয়ার স্টেট
  const [correctionDetails, setCorrectionDetails] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<{ nidImage?: string; birthImage?: string }>({})
  
  // 🔥 নতুন জন্মনিবন্ধন এর বিশেষ স্টেট
  const [birthForm, setBirthForm] = useState({
    motherNidOrBirth: '',
    fatherNidOrBirth: '',
    childName: '',
    birthDateTimePlace: '',
    permanentAddress: '',
    guardianPhone: ''
  })

  const [submitting, setSubmitting] = useState(false)

  // টোস্ট নোটিফিকেশন
  const [toast, setToast] = useState<{ title: string; message: string; show: boolean; actionBtn?: string; actionType?: 'recharge' | 'auth' } | null>(null)

  useEffect(() => {
    const initDashboard = async () => {
      setServices(staticServices)

      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('bd_portal_user') : null
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        const userFullName = profileData?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'প্রিয় নাগরিক'
        setProfile({ ...profileData, full_name: userFullName })
        setIsRegistered(true)
      } else if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser)
          setProfile(parsed)
          setIsRegistered(Boolean(parsed.phone || parsed.full_name !== 'প্রিয় নাগরিক'))
        } catch (e) {
          setProfile({ id: 'guest_user', full_name: 'প্রিয় নাগরিক', balance: 0, role: 'citizen' } as any)
          setIsRegistered(false)
        }
      } else {
        setProfile({ id: 'guest_user', full_name: 'প্রিয় নাগরিক', balance: 0, role: 'citizen' } as any)
        setIsRegistered(false)
      }

      setLoading(false)
    }

    initDashboard()
  }, [])

  const triggerToast = (title: string, message: string, actionBtn?: string, actionType?: 'recharge' | 'auth') => {
    setToast({ title, message, show: true, actionBtn, actionType })
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, show: false } : null)
    }, 5500)
  }

  // 🎯 সার্ভিসে ক্লিক করলে যা হবে
  const handleServiceClick = (service: any) => {
    if (!isRegistered) {
      setAuthTab('register')
      setAuthModalOpen(true)
      triggerToast(
        '🔒 একাউন্ট রেজিস্ট্রেশন প্রয়োজন',
        `"${service.title}" সেবাটি চালু করতে অনুগ্রহ করে প্রথমে আপনার নামে একটি একাউন্ট তৈরি করুন।`,
        'রেজিস্ট্রেশন করুন',
        'auth'
      )
      return
    }

    const currentBalance = profile?.balance || 0
    if (currentBalance < service.price) {
      triggerToast(
        '⚠️ ব্যালেন্স রিচার্জ প্রয়োজন',
        `"${service.title}" সেবার ফি ৳ ${service.price}। আপনার বর্তমান ব্যালেন্স ৳ ${currentBalance}। সেবাটি চালু করতে ব্যালেন্স রিচার্জ করুন।`,
        'রিচার্জ করুন',
        'recharge'
      )
      return
    }

    setActiveService(service)
    setOrderInput('')
    setCorrectionDetails('')
    setUploadedFiles({})
    setBirthForm({
      motherNidOrBirth: '',
      fatherNidOrBirth: '',
      childName: '',
      birthDateTimePlace: '',
      permanentAddress: '',
      guardianPhone: profile?.phone || ''
    })
  }

  // ছবি আপলোড হ্যান্ডলার (আইডি কার্ড / জন্ম নিবন্ধন)
  const handleFileUpload = (type: 'nidImage' | 'birthImage', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [type]: file.name
      }))
    }
  }

  // সার্ভিস টাইপ চেক
  const isCorrectionService = activeService?.id?.includes('correction') || 
                              activeService?.id?.includes('transfer') || 
                              activeService?.title?.includes('সংশোধন') ||
                              activeService?.title?.includes('স্থানান্তর')

  const isNewBirthService = activeService?.id === 'new-birth-reg' || 
                            activeService?.title?.includes('নতুন জন্মনিবন্ধন')

  // 🔐 ডাইনামিক রেজিস্ট্রেশন ও লগইন
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    const cleanName = authForm.name.trim() || 'নাগরিক'
    const cleanPhone = authForm.phone.trim()
    const password = authForm.password.trim()

    try {
      if (authTab === 'register') {
        const emailToUse = authForm.email || `${cleanPhone}@service.gov.bd`
        await supabase.auth.signUp({
          email: emailToUse,
          password: password,
          options: { data: { full_name: cleanName, phone: cleanPhone } }
        })

        const newUserProfile = {
          id: 'usr_' + cleanPhone,
          full_name: cleanName,
          phone: cleanPhone,
          balance: 0,
          role: 'citizen'
        }

        setProfile(newUserProfile as any)
        setIsRegistered(true)
        localStorage.setItem('bd_portal_user', JSON.stringify(newUserProfile))
        setAuthModalOpen(false)

        triggerToast(
          `অভিনন্দন, ${cleanName}!`,
          'আপনার একাউন্ট সফলভাবে সক্রিয় হয়েছে! এবার সেবা পেতে ব্যালেন্স রিচার্জ করুন।',
          'ব্যালেন্স রিচার্জ করুন',
          'recharge'
        )
      } else {
        const loggedUser = {
          id: 'usr_' + cleanPhone,
          full_name: cleanName !== 'নাগরিক' ? cleanName : 'ব্যবহারকারী',
          phone: cleanPhone,
          balance: 0,
          role: 'citizen'
        }
        setProfile(loggedUser as any)
        setIsRegistered(true)
        localStorage.setItem('bd_portal_user', JSON.stringify(loggedUser))
        setAuthModalOpen(false)
        triggerToast('লগইন সফল!', `স্বাগতম, আপনার একাউন্ট লোড হয়েছে।`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAuthLoading(false)
    }
  }

  // সেবা অর্ডার সাবমিট (সংশোধন, নতুন জন্মনিবন্ধন ও অন্যান্য)
  const handlePlaceOrder = async (service: any) => {
    let payload = ''

    if (isNewBirthService) {
      if (!birthForm.childName.trim()) return alert('অনুগ্রহ করে বাচ্চার নাম (বাংলা ও ইংরেজি) দিন!')
      if (!birthForm.motherNidOrBirth.trim()) return alert('অনুগ্রহ করে মাতার NID / জন্মনিবন্ধন নম্বর দিন!')
      if (!birthForm.fatherNidOrBirth.trim()) return alert('অনুগ্রহ করে পিতার NID / জন্মনিবন্ধন নম্বর দিন!')
      if (!birthForm.birthDateTimePlace.trim()) return alert('অনুগ্রহ করে জন্মতারিখ, সময় ও স্থান দিন!')
      if (!birthForm.permanentAddress.trim()) return alert('অনুগ্রহ করে স্থায়ী ঠিকানা দিন!')
      if (!birthForm.guardianPhone.trim()) return alert('অনুগ্রহ করে অভিভাবকের ফোন নম্বর দিন!')

      payload = JSON.stringify({
        service_type: 'নতুন জন্মনিবন্ধন',
        child_name: birthForm.childName.trim(),
        mother_nid_or_birth: birthForm.motherNidOrBirth.trim(),
        father_nid_or_birth: birthForm.fatherNidOrBirth.trim(),
        birth_datetime_place: birthForm.birthDateTimePlace.trim(),
        permanent_address: birthForm.permanentAddress.trim(),
        guardian_phone: birthForm.guardianPhone.trim(),
        delivery_note: '২৪ ঘণ্টার মধ্যেই অনলাইন হবে'
      })
    } else if (isCorrectionService) {
      if (!orderInput.trim()) return alert('অনুগ্রহ করে বর্তমান NID নম্বর বা আবেদনকারীর তথ্য দিন!')
      if (!correctionDetails.trim()) return alert('অনুগ্রহ করে সংশোধিত তথ্য চাহিদা লিখুন!')

      payload = JSON.stringify({
        nid_or_info: orderInput.trim(),
        demanded_correction: correctionDetails.trim(),
        attached_nid: uploadedFiles.nidImage || 'জমা দেওয়া হয়নি',
        attached_birth_cert: uploadedFiles.birthImage || 'জমা দেওয়া হয়নি'
      })
    } else {
      if (!orderInput.trim()) return alert('অনুগ্রহ করে প্রয়োজনীয় তথ্য দিন!')
      payload = orderInput.trim()
    }

    setSubmitting(true)

    const { data, error: rpcError } = await supabase.rpc('place_order', {
      p_service_id: service.id,
      p_service_name: service.title,
      p_price: service.price,
      p_input_data: payload,
    })

    if (rpcError || (data && !data.success)) {
      alert(rpcError?.message || data?.message || 'অর্ডার করতে সমস্যা হয়েছে।')
    } else {
      if (isNewBirthService) {
        alert('✅ আপনার নতুন জন্মনিবন্ধন আবেদন সফলভাবে জমা হয়েছে! ২৪ ঘণ্টার মধ্যেই অনলাইন হয়ে যাবে।')
      } else if (isCorrectionService) {
        alert('✅ আপনার সংশোধন আবেদন সফল হয়েছে! ৩ দিনের মধ্যে সমাধান হয়ে যাবে।')
      } else {
        alert('✅ আপনার সেবা অর্ডার সফল হয়েছে!')
      }
      
      setActiveService(null)
      setOrderInput('')
      setCorrectionDetails('')
      setUploadedFiles({})
      setProfile(prev => {
        const updated = prev ? { ...prev, balance: (prev.balance || 0) - service.price } : null
        if (updated) localStorage.setItem('bd_portal_user', JSON.stringify(updated))
        return updated
      })
    }
    setSubmitting(false)
  }

  // লগআউট
  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('bd_portal_user')
    setIsRegistered(false)
    setProfile({ id: 'guest_user', full_name: 'প্রিয় নাগরিক', balance: 0, role: 'citizen' } as any)
    router.push('/')
  }

  const filteredServices = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((s.titleEn || s.title_en) && (s.titleEn || s.title_en).toLowerCase().includes(searchQuery.toLowerCase()))
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

  const displayName = profile?.full_name || 'প্রিয় নাগরিক'
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen flex bg-[#f3f0ff] font-sans antialiased relative">

      {/* 🔔 নোটিফিকেশন টোস্ট */}
      {toast && toast.show && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-white border-2 border-amber-400 shadow-2xl flex items-start gap-3.5 w-84 sm:w-96 animate-fade-in">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 border border-amber-200">
            <CreditCard size={18} />
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-black text-slate-900">{toast.title}</h5>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-semibold">{toast.message}</p>
            {toast.actionBtn && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setToast(null)
                    if (toast.actionType === 'auth') {
                      setAuthModalOpen(true)
                    } else {
                      router.push('/dashboard/balance')
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-bold text-[11px] shadow-sm cursor-pointer"
                >
                  {toast.actionBtn}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-2 py-1 text-purple-700 hover:text-purple-900 text-[11px] font-bold cursor-pointer"
                >
                  হোমপেজে যান
                </button>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="px-2 py-1 text-slate-400 hover:text-slate-700 text-[11px] font-semibold cursor-pointer"
                >
                  বন্ধ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔐 রেজিস্ট্রেশন ও লগইন মোডাল */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-[420px] max-h-[92vh] my-auto bg-white rounded-3xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden">
            <div className="h-1.5 shrink-0 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500" />

            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="p-6 sm:p-7 overflow-y-auto">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl mb-2 shadow-sm">
                  ন
                </div>
                <h3 className="text-lg font-black text-slate-900">নাগরিক সেবা একাউন্ট</h3>
                <p className="text-[11px] text-slate-500 font-medium">আপনার নাম দিয়ে ফ্রি একাউন্ট তৈরি করুন</p>
              </div>

              <div className="p-1 rounded-xl bg-slate-100 flex gap-1 mb-4">
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    authTab === 'register' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  নতুন একাউন্ট (রেজিস্ট্রেশন)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    authTab === 'login' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600'
                  }`}
                >
                  লগইন
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authTab === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">আপনার পূর্ণ নাম</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="আপনার পুরো নাম লিখুন"
                        value={authForm.name}
                        onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={authForm.phone}
                      onChange={e => setAuthForm({ ...authForm, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">পাসওয়ার্ড</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="পাসওয়ার্ড দিন"
                      value={authForm.password}
                      onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                      className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? 'প্রক্রিয়াধীন...' : (authTab === 'register' ? 'রেজিস্ট্রেশন সম্পন্ন করুন →' : 'লগইন করুন →')}
                </button>
              </form>

              {/* হোমপেজে ফিরে যাওয়ার বাটন */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="text-xs text-purple-700 hover:text-purple-900 font-bold inline-flex items-center gap-1.5 hover:underline cursor-pointer py-1"
                >
                  <ArrowLeft size={14} /> এখন রেজিস্ট্রেশন করতে চাই না, হোমপেজে ফিরে যান
                </button>
              </div>

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
          <Link href="/" className="text-white font-black text-xl tracking-tight flex items-center gap-2">
            <span>নাগরিক সেবা</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* 🟡🟠 ব্যালেন্স কার্ড */}
        <div className="px-4 py-5">
          <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-3xl p-5 text-center text-slate-950 shadow-lg border border-amber-300/40">
            <p className="text-xs font-black mb-1.5 uppercase tracking-wider text-slate-900">
              বর্তমান ব্যালেন্স
            </p>
            <p className="text-3xl font-black mb-4 text-slate-950 font-mono">
              {profile?.balance || 0} ৳
            </p>
            <button
              onClick={() => {
                if (!isRegistered) {
                  setAuthModalOpen(true)
                  return
                }
                router.push('/dashboard/balance')
              }}
              className="block text-center w-full bg-white text-orange-600 py-2.5 rounded-xl text-xs sm:text-sm font-black hover:bg-orange-50 transition shadow-sm cursor-pointer"
            >
              রিচার্জ করুন
            </button>
          </div>
        </div>

        {/* মেনু আইটেম */}
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

        {/* নিচের অ্যাকশন বাটনসমূহ */}
        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 transition font-bold text-xs cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>হোমপেজে ফিরে যান</span>
          </Link>

          {isRegistered ? (
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-300 hover:text-white hover:bg-rose-600/30 transition font-bold text-xs cursor-pointer"
            >
              <LogOut size={16} /> লগআউট
            </button>
          ) : (
            <button
              onClick={() => { setAuthTab('register'); setAuthModalOpen(true) }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition shadow-sm cursor-pointer"
            >
              <UserCheck size={16} /> একাউন্ট রেজিস্ট্রেশন
            </button>
          )}
        </div>
      </aside>

      {/* ── মূল ড্যাশবোর্ড বডি ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* হেডার বার */}
        <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-30 h-[68px] flex items-center px-4 sm:px-6 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer">
            <Menu size={22} />
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition border border-purple-200"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">হোমপেজ</span>
          </Link>

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

            {/* ইউজার প্রোফাইল হেডার */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-black text-slate-800 leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-purple-700 font-bold font-mono mt-0.5">
                  ব্যালেন্স: {profile?.balance || 0}৳
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-md uppercase">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* ড্যাশবোর্ড কন্টেন্ট */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">

          {/* 🟣 পার্পল ব্যানার */}
          <div className="relative bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#9333ea] rounded-3xl p-6 sm:p-9 text-white overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-black mb-1.5 leading-tight flex items-center gap-2">
                আস্সালামু আলাইকুম, {displayName}! 👋
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm mb-5 font-semibold">
                আজকে আপনি কোন সরকারি সেবাটি নিতে চান?
              </p>
              
              <button
                onClick={() => {
                  if (!isRegistered) {
                    setAuthModalOpen(true)
                    return
                  }
                  router.push('/dashboard/balance')
                }}
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
                  className="bg-white hover:bg-gradient-to-br hover:from-white hover:to-purple-50/40 rounded-3xl p-5 flex flex-col items-center text-center border border-purple-100/70 shadow-sm hover:shadow-lg hover:border-purple-300 hover:-translate-y-1 transition group cursor-pointer relative"
                >
                  {/* ডেলিভারি সময় ব্যাজ */}
                  {service.deliveryTime && (
                    <div className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                      ⏱ {service.deliveryTime}
                    </div>
                  )}

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
                    {!isRegistered ? (
                      <span className="text-indigo-600 font-bold">সেবা নিন →</span>
                    ) : needsRecharge ? (
                      <span className="text-amber-600 font-bold">রিচার্জ লাগবে →</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">সেবা ওপেন করুন →</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </main>
      </div>

      {/* ── 🔥 সেবা অর্ডার উইন্ডো ── */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto" onClick={() => setActiveService(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-7 shadow-2xl border border-purple-100 max-h-[92vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            
            {/* সার্ভিস হেডার */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-50 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl ${activeService.color || 'bg-purple-50 text-purple-600'} flex items-center justify-center text-2xl shadow-sm border border-purple-100 shrink-0`}>
                  {activeService.icon}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">{activeService.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[#7c3aed] font-black text-xs sm:text-sm font-mono">চার্জ: ৳ {activeService.price}</p>
                    {activeService.deliveryTime && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isNewBirthService ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        ⏱ সময়: {activeService.deliveryTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveService(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* ফর্ম বডি */}
            <div className="py-4 overflow-y-auto space-y-4">

              {/* 🌟 কেইস ১: নতুন জন্মনিবন্ধন ফর্ম */}
              {isNewBirthService ? (
                <div className="space-y-3.5">
                  {/* বিশেষ গ্যারান্টি ব্যানার */}
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <div>
                      <h5 className="text-xs font-black">২৪ ঘণ্টার মধ্যেই অনলাইন হবে!</h5>
                      <p className="text-[10px] text-emerald-700 font-semibold">নিচে দেওয়া সঠিক তথ্যগুলো পূরণ করে আবেদন জমা দিন।</p>
                    </div>
                  </div>

                  {/* ১. বাচ্চার নাম */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বাচ্চার নাম (বাংলা ও ইংরেজি) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={birthForm.childName}
                      onChange={e => setBirthForm({ ...birthForm, childName: e.target.value })}
                      placeholder="যেমন: আরিয়ান আহমেদ / Ariyan Ahmed"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* ২. মাতার NID / জন্মনিবন্ধন */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        মাতার NID / জন্মনিবন্ধন নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={birthForm.motherNidOrBirth}
                        onChange={e => setBirthForm({ ...birthForm, motherNidOrBirth: e.target.value })}
                        placeholder="মাতার NID বা জন্মনিবন্ধন নং"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800"
                      />
                    </div>

                    {/* ৩. পিতার NID / জন্মনিবন্ধন */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        পিতার NID / জন্মনিবন্ধন নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={birthForm.fatherNidOrBirth}
                        onChange={e => setBirthForm({ ...birthForm, fatherNidOrBirth: e.target.value })}
                        placeholder="পিতার NID বা জন্মনিবন্ধন নং"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* ৪. জন্মতারিখ, সময় ও স্থান */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      জন্মতারিখ, সময় ও স্থান <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={birthForm.birthDateTimePlace}
                      onChange={e => setBirthForm({ ...birthForm, birthDateTimePlace: e.target.value })}
                      placeholder="যেমন: ১৫/০৩/২০২৩, সকাল ১০:৩০, ঢাকা মেডিকেল"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800"
                    />
                  </div>

                  {/* ৫. স্থায়ী ঠিকানা */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      স্থায়ী ঠিকানা <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={birthForm.permanentAddress}
                      onChange={e => setBirthForm({ ...birthForm, permanentAddress: e.target.value })}
                      placeholder="গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800"
                    />
                  </div>

                  {/* ৬. অভিভাবকের ফোন নম্বর */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      অভিভাবকের ফোন নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={birthForm.guardianPhone}
                      onChange={e => setBirthForm({ ...birthForm, guardianPhone: e.target.value })}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800"
                    />
                  </div>
                </div>
              ) : isCorrectionService ? (
                /* 🌟 কেইস ২: আইডি কার্ড সংশোধন ফর্ম */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      বর্তমান NID নম্বর / মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderInput}
                      onChange={e => setOrderInput(e.target.value)}
                      placeholder="আপনার বর্তমান জাতীয় পরিচয়পত্র নম্বর দিন"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>সংশোধিত তথ্যের চাহিদা (কী পরিবর্তন হবে)</span>
                      <span className="text-[10px] text-purple-600 font-bold">*অবশ্যই দিন</span>
                    </label>
                    <textarea
                      rows={3}
                      value={correctionDetails}
                      onChange={e => setCorrectionDetails(e.target.value)}
                      placeholder="আপনি ঠিক কি কি সংশোধন করতে চান বিস্তারিত লিখুন (যেমন: নতুন নাম / সঠিক জন্মতারিখ / কাঙ্ক্ষিত ঠিকানা)..."
                      className="w-full px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-xs sm:text-sm font-medium text-slate-800 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                    <p className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <ImageIcon size={16} className="text-amber-700" />
                      <span>আইডি কার্ড এবং জন্ম নিবন্ধনএর ছবি এখানে জমা দিন</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-amber-300 rounded-xl bg-white hover:bg-amber-50/50 transition cursor-pointer text-center">
                        <Upload size={18} className="text-amber-600 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700">আইডি কার্ডের ছবি</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">
                          {uploadedFiles.nidImage ? `✅ ${uploadedFiles.nidImage}` : 'ছবি সিলেক্ট করুন'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={e => handleFileUpload('nidImage', e)}
                        />
                      </label>

                      <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-amber-300 rounded-xl bg-white hover:bg-amber-50/50 transition cursor-pointer text-center">
                        <Upload size={18} className="text-amber-600 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700">জন্ম নিবন্ধনের ছবি</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">
                          {uploadedFiles.birthImage ? `✅ ${uploadedFiles.birthImage}` : 'ছবি সিলেক্ট করুন'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={e => handleFileUpload('birthImage', e)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                /* 🌟 কেইস ৩: অন্যান্য সাধারণ সেবা */
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {activeService.inputLabel || 'প্রয়োজনীয় তথ্য (NID / ফরম নম্বর)'}
                  </label>
                  <input
                    type="text"
                    value={orderInput}
                    onChange={e => setOrderInput(e.target.value)}
                    placeholder={activeService.inputPlaceholder || 'এখানে লিখুন...'}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white text-xs sm:text-sm font-semibold text-slate-800"
                    autoFocus
                  />
                </div>
              )}

            </div>

            {/* বাটনসমূহ */}
            <div className="pt-3 border-t border-slate-100 flex gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setActiveService(null)} 
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-slate-600 text-xs sm:text-sm transition cursor-pointer"
              >
                বাতিল
              </button>
              <button 
                type="button"
                onClick={() => handlePlaceOrder(activeService)} 
                disabled={submitting} 
                className="flex-1 py-3 bg-[#7c3aed] hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg text-xs sm:text-sm transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'লোড হচ্ছে...' : <><Send size={15} /><span>{isNewBirthService ? 'আবেদন জমা দিন' : 'অর্ডার কনফার্ম করুন'}</span></>}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}