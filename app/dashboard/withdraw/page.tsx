'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Wallet, CheckCircle, Clock, XCircle,
  ArrowDownToLine, Smartphone, Hash, AlertTriangle, RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'

type WithdrawRequest = {
  id: string
  amount: number
  method: string
  account_number: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  admin_note?: string
}

export default function WithdrawPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [requests, setRequests] = useState<WithdrawRequest[]>([])
  const [loadingRequests, setLoadingRequests] = useState(false)

  // Form state
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash')
  const [accountNumber, setAccountNumber] = useState('')
  const [step, setStep] = useState<'form' | 'success'>('form')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth/login'); return }

      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(profileData)
      setLoading(false)
      fetchRequests()
    }
    init()
  }, [router])

  const fetchRequests = async () => {
    setLoadingRequests(true)
    const { data } = await supabase
      .from('withdraw_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    setRequests(data || [])
    setLoadingRequests(false)
  }

  const handleSubmit = async () => {
    if (!amount || !accountNumber) return alert('সব তথ্য পূরণ করুন')
    const numAmount = Number(amount)
    if (numAmount < 500) return alert('সর্বনিম্ন উইথড্র পরিমাণ ৫০০ টাকা')
    if (numAmount > (profile?.balance || 0)) return alert('আপনার ব্যালেন্স পর্যাপ্ত নয়')
    if (!/^01[3-9]\d{8}$/.test(accountNumber)) return alert('সঠিক মোবাইল নম্বর দিন')

    setSubmitting(true)
    const { error } = await supabase.from('withdraw_requests').insert({
      user_id: profile?.id,
      amount: numAmount,
      method,
      account_number: accountNumber,
      status: 'pending',
    })

    if (error) {
      alert('উইথড্র রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে: ' + error.message)
    } else {
      // Deduct balance temporarily and mark as pending
      await supabase
        .from('profiles')
        .update({ balance: (profile?.balance || 0) - numAmount })
        .eq('id', profile?.id)

      await supabase.from('transactions').insert({
        user_id: profile?.id,
        type: 'deduct',
        amount: numAmount,
        method,
        status: 'pending',
        description: `Withdraw request via ${method} to ${accountNumber}`,
      })

      setStep('success')
      fetchRequests()
    }
    setSubmitting(false)
  }

  const statusBadge = (status: string) => {
    if (status === 'pending') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
        <Clock size={11} /> অপেক্ষায়
      </span>
    )
    if (status === 'approved') return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
        <CheckCircle size={11} /> অনুমোদিত
      </span>
    )
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
        <XCircle size={11} /> বাতিল
      </span>
    )
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0edff] to-[#e8f4fd]">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-4 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[#7c3aed] font-bold">লোড হচ্ছে...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f0edff] to-[#e8f4fd] pb-16">
      {/* ── TOP HEADER ── */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 h-[60px] flex items-center px-4 gap-3">
        <Link href="/dashboard" className="p-2 text-gray-500 hover:text-violet-600 rounded-xl hover:bg-violet-50 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-base font-black text-gray-800">উইথড্র / টাকা তুলুন</h1>
        <div className="ml-auto">
          <span className="text-xs text-violet-600 font-bold bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
            ব্যালেন্স: {profile?.balance || 0}৳
          </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">

        {/* ── BALANCE CARD ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1a0533] via-[#5b21b6] to-[#7c3aed] rounded-3xl p-6 text-white shadow-[0_20px_60px_rgba(124,58,237,0.4)]">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-20 w-28 h-28 bg-fuchsia-400/20 rounded-full blur-xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-violet-200 text-xs font-medium mb-1 tracking-wide">বর্তমান ব্যালেন্স</p>
              <p className="text-4xl font-black tracking-tight">{profile?.balance || 0} <span className="text-2xl text-violet-300">৳</span></p>
              <p className="text-violet-300 text-xs mt-2">সর্বনিম্ন উইথড্র: ৫০০ টাকা</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shadow-inner">
              <ArrowDownToLine size={30} className="text-white" />
            </div>
          </div>
        </div>

        {step === 'success' ? (
          /* ── SUCCESS STATE ── */
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">রিকোয়েস্ট পাঠানো হয়েছে!</h2>
            <p className="text-gray-500 text-sm mb-6">আপনার উইথড্র রিকোয়েস্ট পাওয়া গেছে। এডমিন যাচাই করার পর ২৪ ঘণ্টার মধ্যে পাঠিয়ে দেওয়া হবে।</p>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700 text-xs font-medium">আপনার ব্যালেন্স থেকে টাকা হোল্ডে রাখা হয়েছে। রিকোয়েস্ট বাতিল হলে ফেরত আসবে।</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setStep('form'); setAmount(''); setAccountNumber('') }}
                className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition"
              >
                আবার উইথড্র করুন
              </button>
              <Link href="/dashboard" className="flex-1 py-3.5 bg-[#7c3aed] text-white rounded-2xl font-bold text-center hover:bg-violet-700 transition shadow-lg shadow-violet-200">
                ড্যাশবোর্ড
              </Link>
            </div>
          </div>
        ) : (
          /* ── FORM ── */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <Wallet size={20} className="text-violet-600" /> উইথড্র ফর্ম
            </h2>

            {/* Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <Clock size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 font-bold text-sm">প্রক্রিয়াকরণের সময়</p>
                <p className="text-blue-600 text-xs mt-0.5">রিকোয়েস্ট পাঠানোর পর ২৪ ঘণ্টার মধ্যে পেমেন্ট পাঠিয়ে দেওয়া হবে।</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">পেমেন্ট মাধ্যম বেছে নিন</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* bKash */}
                <button
                  onClick={() => setMethod('bKash')}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:-translate-y-1 ${method === 'bKash'
                    ? 'border-[#e2136e] bg-pink-50/30 shadow-[0_8px_30px_rgba(226,19,110,0.15)]'
                    : 'border-gray-100 bg-pink-50/10 hover:border-pink-300 hover:shadow-[0_8px_30px_rgba(226,19,110,0.10)]'}`}
                >
                  <p className="text-[#e2136e] text-xs font-bold mb-3 uppercase tracking-tight">
                    BKASH (PERSONAL)
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold tracking-wider text-gray-800">বিকাশ</p>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm border ${method === 'bKash' ? 'bg-white border-pink-200 text-[#e2136e]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {method === 'bKash' ? <CheckCircle size={14} className="text-[#e2136e]" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-400" />}
                      <span>{method === 'bKash' ? 'Selected' : 'Select'}</span>
                    </div>
                  </div>
                </button>

                {/* Nagad */}
                <button
                  onClick={() => setMethod('Nagad')}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:-translate-y-1 ${method === 'Nagad'
                    ? 'border-[#f7941d] bg-orange-50/30 shadow-[0_8px_30px_rgba(247,148,29,0.15)]'
                    : 'border-gray-100 bg-orange-50/10 hover:border-orange-300 hover:shadow-[0_8px_30px_rgba(247,148,29,0.10)]'}`}
                >
                  <p className="text-[#f7941d] text-xs font-bold mb-3 uppercase tracking-tight">
                    NAGAD (PERSONAL)
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold tracking-wider text-gray-800">নগদ</p>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm border ${method === 'Nagad' ? 'bg-white border-orange-200 text-[#f7941d]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {method === 'Nagad' ? <CheckCircle size={14} className="text-[#f7941d]" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-400" />}
                      <span>{method === 'Nagad' ? 'Selected' : 'Select'}</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Number */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                {method} নম্বর
              </label>
              <div className="relative">
                <Smartphone size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${method === 'bKash' ? 'text-[#e2136e]' : 'text-[#f7941d]'}`} />
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all text-gray-800 font-medium tracking-wide ${method === 'bKash'
                    ? 'focus:ring-2 focus:ring-pink-300 focus:border-[#e2136e]'
                    : 'focus:ring-2 focus:ring-orange-300 focus:border-[#f7941d]'} border-gray-200`}
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 ml-1">যে নম্বরে টাকা পাঠাতে চান সেই {method} নম্বরটি দিন</p>
            </div>

            {/* Amount */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">উইথড্র পরিমাণ (৳)</label>
              <div className="relative">
                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="সর্বনিম্ন ৫০০ টাকা"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-300 focus:border-violet-500 outline-none transition-all text-gray-800 font-medium"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="500"
                  max={profile?.balance || 0}
                />
              </div>
              {/* Quick amount buttons */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {[500, 1000, 2000, 5000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setAmount(String(amt))}
                    className="px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-xl text-xs font-bold hover:bg-violet-100 transition"
                  >
                    ৳{amt}
                  </button>
                ))}
                <button
                  onClick={() => setAmount(String(profile?.balance || 0))}
                  className="px-3 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition"
                >
                  সব টাকা
                </button>
              </div>
              {amount && Number(amount) > 0 && (
                <div className="mt-3 bg-violet-50 border border-violet-100 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs text-violet-600 font-medium">আপনি পাবেন:</span>
                  <span className="text-violet-800 font-black text-sm">৳ {Number(amount).toLocaleString('bn-BD')}</span>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-800 font-bold text-sm">গুরুত্বপূর্ণ!</p>
                <p className="text-amber-700 text-xs mt-0.5">নম্বর ভুল দিলে টাকা ফেরত পাওয়া সম্ভব নাও হতে পারে। সাবধানে নম্বর দিন।</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full py-4 rounded-2xl font-black text-white text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed
                ${method === 'bKash'
                  ? 'bg-gradient-to-r from-[#e2136e] to-[#c01058] shadow-[#e2136e]/30 hover:shadow-[#e2136e]/50 hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-[#f7941d] to-[#e07800] shadow-[#f7941d]/30 hover:shadow-[#f7941d]/50 hover:-translate-y-0.5'
                }`}
            >
              {submitting
                ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> প্রসেসিং...</>
                : <><ArrowDownToLine size={20} /> {method} তে উইথড্র করুন</>
              }
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full mt-3 py-3.5 bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-2xl font-semibold transition-all flex justify-center items-center gap-2"
            >
              <ArrowLeft size={18} /> ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        )}

        {/* ── HISTORY ── */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
              <Clock size={18} className="text-violet-600" /> উইথড্র ইতিহাস
            </h3>
            <button
              onClick={fetchRequests}
              className="p-2 text-gray-400 hover:text-violet-600 rounded-xl hover:bg-violet-50 transition"
            >
              <RefreshCw size={16} className={loadingRequests ? 'animate-spin' : ''} />
            </button>
          </div>

          {loadingRequests ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-3 border-violet-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Wallet size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-sm">কোনো উইথড্র রেকর্ড নেই</p>
              <p className="text-gray-400 text-xs mt-1">প্রথম উইথড্র করুন উপরের ফর্ম থেকে</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map(req => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-violet-200 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0
                      ${req.method === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#f7941d]'}`}>
                      {req.method === 'bKash' ? '৳' : '৳'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{req.method} — {req.account_number}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(req.created_at).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      {req.admin_note && (
                        <p className="text-[11px] text-red-500 mt-0.5">নোট: {req.admin_note}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-800 mb-1">৳{req.amount}</p>
                    {statusBadge(req.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
