'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Palmtree, Lock, Mail, Loader2 } from 'lucide-react';
import { createClient } from '@/modules/shared/lib/supabase/client';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setErrorMsg(error.message);
        } else {
            router.push('/admin');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl border border-[#e6c898]/40 shadow-xl p-8 space-y-6">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-[#1c120c] text-[#c89349] rounded-2xl flex items-center justify-center mx-auto shadow-md">
                        <Palmtree className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#1c120c] tracking-tight">SEAVIEW DESK</h1>
                    <p className="text-xs text-[#2b1d14]/60 uppercase tracking-widest font-bold">Admin Portal Access</p>
                </div>

                {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center">
                        {errorMsg}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40 flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#c89349]" />
                        <div className="w-full">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@seaview.com"
                                className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-[#e6c898]/40 flex items-center gap-3">
                        <Lock className="w-4 h-4 text-[#c89349]" />
                        <div className="w-full">
                            <label className="block text-[10px] font-bold text-[#2b1d14]/60 uppercase tracking-widest">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full text-xs font-semibold text-[#1c120c] bg-transparent outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-[#1c120c] text-[#faf7f2] font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#2b1d14] active:scale-95 transition"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}