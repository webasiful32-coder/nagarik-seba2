'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Clock, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react' // ArrowLeft যোগ করা হয়েছে

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const getOrders = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { router.push('/auth/login'); return }

            const { data: ordersData } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })

            setOrders(ordersData || [])
            setLoading(false)
        }
        getOrders()
    }, [router])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="text-violet-500" size={20} />;
            case 'pending': return <Clock className="text-yellow-500" size={20} />;
            case 'cancelled': return <XCircle className="text-red-500" size={20} />;
            default: return <AlertTriangle className="text-gray-500" size={20} />;
        }
    }

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

            <h1 className="text-2xl font-bold text-gray-800 mb-6">আমার অর্ডার সমূহ</h1>

            {orders.length === 0 ? (
                <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500">আপনার কোনো অর্ডার নেই।</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-800">{order.service_name}</h3>
                                <p className="text-sm text-gray-500">তথ্য: {JSON.stringify(order.input_data)}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(order.created_at).toLocaleString('bn-BD')}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-violet-700">{order.price} ৳</span>
                                <div className="flex items-center gap-2 justify-end mt-1 text-sm font-medium">
                                    {getStatusIcon(order.status)}
                                    <span className={`capitalize ${order.status === 'completed' ? 'text-violet-600' : order.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                                        {order.status === 'pending' ? 'অপেক্ষমাণ' : order.status === 'completed' ? 'সম্পন্ন' : order.status === 'cancelled' ? 'বাতিল' : order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}