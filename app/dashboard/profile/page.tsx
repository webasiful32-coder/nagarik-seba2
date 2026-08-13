'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User, Phone, CreditCard, Mail, ArrowLeft } from 'lucide-react' // ArrowLeft যোগ করা হয়েছে

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const getProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { router.push('/auth/login'); return }

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

            setProfile(profileData)
            setLoading(false)
        }
        getProfile()
    }, [router])

    if (loading) return <div className="p-6 text-center">লোড হচ্ছে...</div>

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* --- ড্যাশবোর্ডে ফিরে যাওয়ার বাটন --- */}
            <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-500 hover:text-violet-700 mb-6 text-sm font-bold"
            >
                <ArrowLeft size={16} /> ড্যাশবোর্ডে ফিরে যান
            </button>
            {/* --------------------------------- */}

            <h1 className="text-2xl font-bold text-gray-800 mb-6">আমার প্রোফাইল</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-lg">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-3xl font-bold">
                        {profile?.full_name?.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{profile?.full_name}</h2>
                        <p className="text-gray-500 text-sm">মেম্বার আইডি: {profile?.id.substring(0, 8)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="text-gray-400" size={20} />
                        <div>
                            <p className="text-xs text-gray-500">ইমেইল</p>
                            <p className="font-medium text-gray-800">{profile?.email || 'ইমেইল নেই'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="text-gray-400" size={20} />
                        <div>
                            <p className="text-xs text-gray-500">ফোন নাম্বার</p>
                            <p className="font-medium text-gray-800">{profile?.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CreditCard className="text-gray-400" size={20} />
                        <div>
                            <p className="text-xs text-gray-500">NID নাম্বার</p>
                            <p className="font-medium text-gray-800">{profile?.nid || 'NID দেওয়া হয়নি'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}