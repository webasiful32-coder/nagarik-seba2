'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, LogIn, Lock, CheckCircle, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [justRegistered, setJustRegistered] = useState(false)
  const [form, setForm] = useState({ identifier: '', password: '' })

  useEffect(() => {
    if (searchParams.get('registered') === 'true') setJustRegistered(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
    })
  }, [searchParams, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.identifier || !form.password) { setError('ইমেইল/ফোন ও পাসওয়ার্ড দিন'); return }

    setLoading(true)

    let emailToLogin = form.identifier

    if (!form.identifier.includes('@')) {
      const { data: profile_email, error: profileError } = await supabase
        .rpc('get_email_by_phone', { p_phone: form.identifier })

      if (profileError || !profile_email || profile_email.length === 0) {
        setError('এই ফোন নাম্বারটি খুঁজে পাওয়া যায়নি')
        setLoading(false)
        return
      }

      emailToLogin = profile_email[0].email
      if (!emailToLogin) {
        setError('এই প্রোফাইলে কোনো ইমেইল পাওয়া যায়নি। দয়া করে ইমেইল দিয়ে লগইন করুন।')
        setLoading(false)
        return
      }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: emailToLogin,
      password: form.password,
    })

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        setError('ইমেইল/ফোন বা পাসওয়ার্ড সঠিক নয়')
      } else {
        setError(signInError.message)
      }
      setLoading(false)
      return
    }

    // লগইন সফল → ড্যাশবোর্ডে যান
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#dcfce7] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-violet-300 opacity-10 blur-3xl"></div>
        <div className="relative text-center text-white">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <span className="text-4xl font-bold">ন</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">নাগরিক সেবা</h1>
          <p className="text-violet-100 text-lg mb-10">বাংলাদেশের নাগরিক সেবা প্ল্যাটফর্ম</p>
          <div className="space-y-4 text-left">
            {[
              'NID, জন্ম নিবন্ধন, TIN সেবা',
              '৪২টিরও বেশি সরকারি সেবা',
              '১০০% নিরাপদ ও দ্রুত সেবা',
              '২৪/৭ সহায়তা পাওয়া যায়',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <CheckCircle size={20} className="text-violet-300 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#8b5cf6] flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-bold text-2xl">স</span>
            </div>
            <h1 className="text-xl font-bold text-[#7c3aed]">সহজ ডিজিটাল সেবা</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">লগইন করুন</h2>
            <p className="text-gray-500 mt-2">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
          </div>

          {justRegistered && (
            <div className="bg-violet-50 border border-violet-200 text-violet-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <CheckCircle size={16} /> রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল বা ফোন নাম্বার</label>
              <div className="relative">
                <Phone size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="identifier"
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder="example@gmail.com বা 01XXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
                <Link href="/auth/forgot" className="text-xs text-[#7c3aed] hover:underline">পাসওয়ার্ড ভুলে গেছেন?</Link>
              </div>
              <div className="relative">
                <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="আপনার পাসওয়ার্ড"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 btn-primary text-white font-bold rounded-xl text-lg disabled:opacity-70"
            >
              {loading
                ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> লগইন হচ্ছে...</>
                : <><LogIn size={20} /> লগইন করুন</>
              }
            </button>

            <p className="text-center text-sm text-gray-500">
              অ্যাকাউন্ট নেই?{' '}
              <Link href="/auth/register" className="text-[#7c3aed] font-bold hover:underline">
                বিনামূল্যে রেজিস্ট্রেশন করুন
              </Link>
            </p>

            <div className="text-center">
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-[#7c3aed] transition-colors underline underline-offset-2">
                লগইন ছাড়াই ড্যাশবোর্ড দেখুন →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}