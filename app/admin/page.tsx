'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const BKASH_NUMBER = '01XXXXXXXXX'  // ← আপনার আসল বিকাশ নাম্বার দিন

export default function AdminPage() {
    const router = useRouter()
    const [tab, setTab] = useState<'transactions' | 'orders' | 'users'>('transactions')
    const [transactions, setTransactions] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editOrder, setEditOrder] = useState<any>(null)
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')

    // ── Auth check ────────────────────────────────────
    useEffect(() => {
        checkAdmin()
    }, [])

    async function checkAdmin() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/auth/login'); return }

        const { data: profile } = await supabase
            .from('profiles').select('role').eq('id', session.user.id).single()

        if (!profile || profile.role !== 'admin') {
            router.push('/dashboard')
            return
        }
        setLoading(false)
        loadAll()
    }

    async function loadAll() {
        loadTransactions()
        loadOrders()
        loadUsers()
    }

    // ── Load data ─────────────────────────────────────
    async function loadTransactions() {
        const { data } = await supabase
            .from('transactions')
            .select('*, profiles(full_name, phone)')
            .order('created_at', { ascending: false })
        setTransactions(data || [])
    }

    async function loadOrders() {
        const { data } = await supabase
            .from('orders')
            .select('*, profiles(full_name, phone)')
            .order('created_at', { ascending: false })
        setOrders(data || [])
    }

    async function loadUsers() {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
        setUsers(data || [])
    }

    // ── Approve Transaction (balance যোগ হবে) ─────────
    async function approveTransaction(txn: any) {
        setSaving(true)
        const { data, error } = await supabase.rpc('approve_transaction', {
            p_transaction_id: txn.id
        })
        setSaving(false)

        if (error || !data?.success) {
            showMsg('❌ ' + (error?.message || data?.message || 'সমস্যা হয়েছে।'))
        } else {
            showMsg('✅ Balance যোগ হয়েছে!')
            loadTransactions()
            loadUsers()
        }
    }

    // ── Reject Transaction ────────────────────────────
    async function rejectTransaction(id: string) {
        await supabase.from('transactions').update({ status: 'rejected' }).eq('id', id)
        showMsg('❌ Transaction বাতিল করা হয়েছে।')
        loadTransactions()
    }

    // ── Update Order ──────────────────────────────────
    async function updateOrder(e: React.FormEvent) {
        e.preventDefault()
        if (!editOrder) return
        setSaving(true)
        await supabase.from('orders')
            .update({ status: editOrder.status, notes: editOrder.notes })
            .eq('id', editOrder.id)
        setSaving(false)
        setEditOrder(null)
        showMsg('✅ Order আপডেট হয়েছে!')
        loadOrders()
    }

    function showMsg(text: string) {
        setMsg(text)
        setTimeout(() => setMsg(''), 3000)
    }

    // ── Stats ─────────────────────────────────────────
    const stats = {
        pendingTxn: transactions.filter(t => t.status === 'pending').length,
        totalTxn: transactions.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalUsers: users.length,
        totalBalance: users.reduce((s, u) => s + (u.balance || 0), 0),
    }

    const statusColor: Record<string, string> = {
        pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444',
        completed: '#10b981', cancelled: '#ef4444', processing: '#8b5cf6'
    }
    const statusBn: Record<string, string> = {
        pending: 'অপেক্ষায়', approved: 'অনুমোদিত', rejected: 'বাতিল',
        completed: 'সম্পন্ন', cancelled: 'বাতিল', processing: 'প্রক্রিয়ায়'
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '4px solid #7c3aed', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: '#7c3aed', fontFamily: 'Hind Siliguri, sans-serif' }}>লোড হচ্ছে...</p>
            </div>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Hind Siliguri, sans-serif' }}>

            {/* Toast */}
            {msg && (
                <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, background: '#2e1065', color: '#fff', padding: '14px 20px', borderRadius: 12, fontSize: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                    {msg}
                </div>
            )}

            {/* Top Bar */}
            <div style={{ background: '#2e1065', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>🌿</span>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Admin Panel — Digital Sheba</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <a href="/dashboard" style={{ color: '#86efac', fontSize: 13, textDecoration: 'none' }}>🌐 Dashboard</a>
                    <button onClick={() => supabase.auth.signOut().then(() => router.push('/auth/login'))}
                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fca5a5', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'Hind Siliguri, sans-serif' }}>
                        লগআউট
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
                    {[
                        { label: 'অপেক্ষায় Deposit', value: stats.pendingTxn, color: '#f59e0b', bg: '#fffbeb' },
                        { label: 'মোট Transaction', value: stats.totalTxn, color: '#8b5cf6', bg: '#eff6ff' },
                        { label: 'Pending Order', value: stats.pendingOrders, color: '#8b5cf6', bg: '#f5f3ff' },
                        { label: 'মোট User', value: stats.totalUsers, color: '#7c3aed', bg: '#f8fafc' },
                    ].map(({ label, value, color, bg }) => (
                        <div key={label} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 14, padding: '18px 16px' }}>
                            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>{label}</div>
                            <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                    {([
                        { key: 'transactions', label: '💳 Deposit Requests' },
                        { key: 'orders', label: '📋 Orders' },
                        { key: 'users', label: '👥 Users' },
                    ] as const).map(({ key, label }) => (
                        <button key={key} onClick={() => setTab(key)}
                            style={{ padding: '9px 18px', borderRadius: 10, border: `1.5px solid ${tab === key ? '#7c3aed' : '#e5e7eb'}`, background: tab === key ? '#7c3aed' : '#fff', color: tab === key ? '#fff' : '#6b7280', cursor: 'pointer', fontFamily: 'Hind Siliguri, sans-serif', fontSize: 14, fontWeight: 600 }}>
                            {label}
                            {key === 'transactions' && stats.pendingTxn > 0 && (
                                <span style={{ background: '#ef4444', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 11, marginLeft: 6 }}>{stats.pendingTxn}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── TRANSACTIONS TAB ── */}
                {tab === 'transactions' && (
                    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb' }}>
                                        {['ব্যবহারকারী', 'ফোন', 'পরিমাণ', 'Method', 'TrxID', 'স্ট্যাটাস', 'তারিখ', 'একশন'].map(h => (
                                            <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length === 0 ? (
                                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>কোনো transaction নেই।</td></tr>
                                    ) : transactions.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>{t.profiles?.full_name || '—'}</td>
                                            <td style={{ padding: '12px 14px', fontSize: 13, color: '#7c3aed' }}>{t.profiles?.phone || '—'}</td>
                                            <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#7c3aed' }}>৳{t.amount}</td>
                                            <td style={{ padding: '12px 14px', fontSize: 13 }}>{t.method}</td>
                                            <td style={{ padding: '12px 14px', fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>{t.trx_id}</td>
                                            <td style={{ padding: '12px 14px' }}>
                                                <span style={{ background: `${statusColor[t.status] || '#6b7280'}20`, color: statusColor[t.status] || '#6b7280', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                                                    {statusBn[t.status] || t.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 14px', fontSize: 11, color: '#9ca3af' }}>
                                                {new Date(t.created_at).toLocaleDateString('bn-BD')}
                                            </td>
                                            <td style={{ padding: '12px 14px' }}>
                                                {t.status === 'pending' && (
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        <button onClick={() => approveTransaction(t)} disabled={saving}
                                                            style={{ background: '#dcfce7', color: '#15803d', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                            ✅ Approve
                                                        </button>
                                                        <button onClick={() => rejectTransaction(t.id)}
                                                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                            ❌ Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── ORDERS TAB ── */}
                {tab === 'orders' && (
                    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb' }}>
                                        {['অর্ডার', 'ব্যবহারকারী', 'সার্ভিস', 'তথ্য', 'মূল্য', 'স্ট্যাটাস', 'একশন'].map(h => (
                                            <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>কোনো অর্ডার নেই।</td></tr>
                                    ) : orders.map(o => (
                                        <tr key={o.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                            <td style={{ padding: '12px 14px' }}>
                                                <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed' }}>{o.order_number || '—'}</div>
                                                <div style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(o.created_at).toLocaleDateString('bn-BD')}</div>
                                            </td>
                                            <td style={{ padding: '12px 14px' }}>
                                                <div style={{ fontSize: 13, fontWeight: 600 }}>{o.profiles?.full_name || '—'}</div>
                                                <div style={{ fontSize: 11, color: '#7c3aed' }}>{o.profiles?.phone || '—'}</div>
                                            </td>
                                            <td style={{ padding: '12px 14px', fontSize: 13 }}>{o.service_name || '—'}</td>
                                            <td style={{ padding: '12px 14px', fontSize: 12, color: '#6b7280', maxWidth: 150 }}>
                                                {typeof o.input_data === 'string'
                                                    ? o.input_data.substring(0, 40) + (o.input_data.length > 40 ? '...' : '')
                                                    : JSON.stringify(o.input_data)?.substring(0, 40) + '...'}
                                            </td>
                                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#7c3aed' }}>৳{o.price}</td>
                                            <td style={{ padding: '12px 14px' }}>
                                                <span style={{ background: `${statusColor[o.status] || '#6b7280'}20`, color: statusColor[o.status] || '#6b7280', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                                                    {statusBn[o.status] || o.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 14px' }}>
                                                <button onClick={() => setEditOrder({ ...o })}
                                                    style={{ background: '#dcfce7', color: '#15803d', border: 'none', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                    সম্পাদনা
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── USERS TAB ── */}
                {tab === 'users' && (
                    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb' }}>
                                        {['নাম', 'ফোন', 'ব্যালেন্স', 'ভূমিকা', 'যোগদান'].map(h => (
                                            <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                            <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>{u.full_name}</td>
                                            <td style={{ padding: '12px 14px', fontSize: 13, color: '#7c3aed' }}>{u.phone}</td>
                                            <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700, color: u.balance > 0 ? '#7c3aed' : '#9ca3af' }}>৳{u.balance || 0}</td>
                                            <td style={{ padding: '12px 14px' }}>
                                                <span style={{ background: u.role === 'admin' ? '#fef3c7' : '#f8fafc', color: u.role === 'admin' ? '#92400e' : '#15803d', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                                                    {u.role === 'admin' ? 'Admin' : 'Client'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 14px', fontSize: 12, color: '#9ca3af' }}>
                                                {new Date(u.created_at).toLocaleDateString('bn-BD')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Edit Order Modal ── */}
            {editOrder && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                    onClick={e => e.target === e.currentTarget && setEditOrder(null)}>
                    <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 440 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2e1065' }}>Order আপডেট করুন</h3>
                            <button onClick={() => setEditOrder(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>✕</button>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>সার্ভিস</div>
                            <div style={{ fontWeight: 600, color: '#2e1065' }}>{editOrder.service_name}</div>
                            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>তথ্য: {editOrder.input_data}</div>
                        </div>

                        <form onSubmit={updateOrder}>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>স্ট্যাটাস</label>
                                <select value={editOrder.status} onChange={e => setEditOrder({ ...editOrder, status: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontFamily: 'Hind Siliguri, sans-serif', fontSize: 14, outline: 'none' }}>
                                    <option value="pending">অপেক্ষায়</option>
                                    <option value="processing">প্রক্রিয়ায়</option>
                                    <option value="completed">সম্পন্ন</option>
                                    <option value="cancelled">বাতিল</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>নোট</label>
                                <textarea rows={3} value={editOrder.notes || ''} onChange={e => setEditOrder({ ...editOrder, notes: e.target.value })}
                                    placeholder="ডেলিভারি তথ্য..."
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontFamily: 'Hind Siliguri, sans-serif', fontSize: 14, outline: 'none', resize: 'vertical' }} />
                            </div>

                            <button type="submit" disabled={saving}
                                style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Hind Siliguri, sans-serif', opacity: saving ? 0.7 : 1 }}>
                                {saving ? 'সংরক্ষণ হচ্ছে...' : '✅ আপডেট করুন'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}