// app/dashboard/balance/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, CheckCircle, Smartphone, Hash } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function BalancePage() {
    const [depositAmount, setDepositAmount] = useState('')
    const [trxId, setTrxId] = useState('')
    const [senderNumber, setSenderNumber] = useState('')
    const [method, setMethod] = useState('bKash')
    const [accountType, setAccountType] = useState('Personal')
    const [submitting, setSubmitting] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)
    const router = useRouter()

    const paymentNumbers = {
        bKash: '01904604113',
        Nagad: '01350084024',
    }

    const handleCopy = (num: string, type: string) => {
        navigator.clipboard.writeText(num)
        setCopied(type)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleAddBalance = async () => {
        if (!depositAmount || !trxId || !senderNumber) return alert("সবগুলো তথ্য সঠিকভাবে পূরণ করুন")
        if (Number(depositAmount) < (accountType === 'Personal' ? 500 : 1000)) {
            return alert(`${accountType === 'Personal' ? 500 : 1000} টাকার নিচে রিচার্জ করা সম্ভব নয়`)
        }

        setSubmitting(true)

        const { data, error } = await supabase.rpc('auto_approve_recharge', {
            p_amount: Number(depositAmount),
            p_trx_id: trxId.trim().toUpperCase(),
            p_method: method,
            p_description: `Recharge: ${accountType}, Sender: ${senderNumber}`,
            p_account_type: accountType,
        })

        setSubmitting(false)

        if (error || (data && !data.success)) {
            alert(data?.message || error?.message || "এই TrxID টি আগে ব্যবহার হয়েছে অথবা ভুল!")
        } else {
            alert("✅ ব্যালেন্স সফলভাবে যোগ হয়েছে! আপনার একাউন্টে টাকা চলে এসেছে।")
            setTrxId('')
            setDepositAmount('')
            setSenderNumber('')
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#ede9fe] text-gray-800 p-4 sm:p-8">
            <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 pt-4">
                    <h1 className="text-4xl font-bold text-[#7c3aed] mb-3">ব্যালেন্স রিচার্জ করুন</h1>
                    <p className="text-gray-500 text-sm font-medium">আপনার অ্যাকাউন্টে ব্যালেন্স যোগ করতে নিচের ফর্মটি পূরণ করুন</p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
                    {/* Account Type Tabs */}
                    <div className="flex bg-gray-100/80 p-1.5 rounded-2xl mb-8">
                        <button
                            onClick={() => setAccountType('Personal')}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${accountType === 'Personal' ? 'bg-[#7c3aed] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Personal Account
                        </button>
                        <button
                            onClick={() => setAccountType('Business')}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${accountType === 'Business' ? 'bg-[#7c3aed] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Business Account
                        </button>
                    </div>

                    {/* ✅ Auto-approve notice */}
                    <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-green-800 font-black text-sm">তাৎক্ষণিক ব্যালেন্স যোগ!</p>
                            <p className="text-green-700 text-xs mt-0.5">সাবমিট করার সাথে সাথেই আপনার ব্যালেন্সে টাকা যোগ হবে।</p>
                        </div>
                    </div>

                    {/* Notice Box */}
                    <div className="bg-[#f8fafc] border border-violet-100 p-5 rounded-2xl mb-6 text-center">
                        {accountType === 'Personal' ? (
                            <>
                                <p className="text-violet-600 font-semibold text-sm mb-1">Personal অ্যাকাউন্টের জন্য সর্বনিম্ন</p>
                                <p className="text-[#2e1065] font-black text-3xl tracking-wide">৫০০ টাকা</p>
                                <p className="text-violet-500 text-xs mt-1">অ্যাড করতে হবে</p>
                            </>
                        ) : (
                            <>
                                <p className="text-violet-600 font-semibold text-sm mb-1">Business অ্যাকাউন্টের জন্য সর্বনিম্ন</p>
                                <p className="text-[#2e1065] font-black text-3xl tracking-wide">১,৪৫০ টাকা</p>
                                <p className="text-violet-500 text-xs mt-1">অ্যাড করতে হবে</p>
                            </>
                        )}
                    </div>

                    {/* Sub Admin Offer Banner */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-[#2e1065] to-[#7c3aed] rounded-2xl p-5 mb-8 text-white">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
                        <div className="relative flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl flex-shrink-0">👑</div>
                            <div>
                                <p className="font-bold text-base mb-1">সাব এডমিন হওয়ার সুযোগ!</p>
                                <p className="text-violet-100 text-sm leading-relaxed">
                                    আমাদের একাউন্টে <span className="font-black text-white bg-white/20 px-2 py-0.5 rounded-lg">সাব এডমিন</span> নিতে চাইলে মাত্র
                                </p>
                                <p className="text-3xl font-black mt-2 text-violet-300">২,৯৫০ ৳</p>
                                <p className="text-violet-200 text-xs mt-1">একবার যোগ করুন — সারাজীবন সুবিধা উপভোগ করুন</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Numbers Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {/* bKash */}
                        <div className="bg-pink-50/30 border border-pink-100/50 p-5 rounded-2xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 hover:shadow-[0_8px_30px_rgba(226,19,110,0.15)] hover:-translate-y-1 transition-all duration-300 relative group">
                            <p className="text-[#e2136e] text-xs font-bold mb-2 uppercase tracking-tight">bKash (Personal)</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold tracking-wider text-gray-800">{paymentNumbers.bKash}</span>
                                <button
                                    onClick={() => handleCopy(paymentNumbers.bKash, 'bKash')}
                                    className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 transition-colors shadow-sm"
                                >
                                    {copied === 'bKash' ? <CheckCircle size={14} className="text-[#7c3aed]" /> : <Copy size={14} />}
                                    <span>Copy</span>
                                </button>
                            </div>
                        </div>

                        {/* Nagad */}
                        <div className="bg-orange-50/30 border border-orange-100/50 p-5 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:border-orange-300 hover:shadow-[0_8px_30px_rgba(247,148,29,0.15)] hover:-translate-y-1 transition-all duration-300 relative group">
                            <p className="text-[#f7941d] text-xs font-bold mb-2 uppercase tracking-tight">Nagad (Personal)</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold tracking-wider text-gray-800">{paymentNumbers.Nagad}</span>
                                <button
                                    onClick={() => handleCopy(paymentNumbers.Nagad, 'Nagad')}
                                    className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 transition-colors shadow-sm"
                                >
                                    {copied === 'Nagad' ? <CheckCircle size={14} className="text-[#7c3aed]" /> : <Copy size={14} />}
                                    <span>Copy</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Method Selector */}
                    <div className="flex gap-2 mb-6">
                        {['bKash', 'Nagad'].map(m => (
                            <button
                                key={m}
                                onClick={() => setMethod(m)}
                                className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${method === m ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-400'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        {/* Sender Number */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Sender Number (bKash/Nagad)</label>
                            <div className="relative">
                                <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    placeholder="01XXXXXXXXX"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-300 focus:border-violet-500 outline-none transition-all"
                                    value={senderNumber}
                                    onChange={e => setSenderNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Transaction ID */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Transaction ID</label>
                            <div className="relative">
                                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="TRX12345678"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-300 focus:border-violet-500 outline-none transition-all uppercase"
                                    value={trxId}
                                    onChange={e => setTrxId(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">টাকার পরিমাণ (৳)</label>
                            <input
                                type="number"
                                placeholder={`সর্বনিম্ন ${accountType === 'Personal' ? '৫০০' : '১,০০০'} টাকা`}
                                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-300 focus:border-violet-500 outline-none transition-all"
                                value={depositAmount}
                                onChange={e => setDepositAmount(e.target.value)}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 space-y-3">
                            <button
                                onClick={handleAddBalance}
                                disabled={submitting}
                                className="w-full py-4 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white rounded-2xl font-black shadow-[0_6px_20px_rgba(124,58,237,0.4)] hover:shadow-[0_10px_30px_rgba(124,58,237,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-70 flex justify-center items-center gap-2 text-lg"
                            >
                                {submitting
                                    ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> প্রসেসিং...</>
                                    : '⚡ তাৎক্ষণিক রিচার্জ করুন'
                                }
                            </button>

                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full py-3.5 bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-2xl font-semibold transition-all flex justify-center items-center gap-2"
                            >
                                <ArrowLeft size={18} /> ড্যাশবোর্ডে ফিরে যান
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}