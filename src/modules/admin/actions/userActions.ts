'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function createStaffUserAction(payload: {
    email: string;
    password: string;
    fullName: string;
    role: string;
}) {
    if (!payload.email || !payload.password || !payload.fullName) {
        return { success: false, message: 'All fields are required.' };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!serviceRoleKey) {
        return { success: false, message: 'SUPABASE_SERVICE_ROLE_KEY is missing in .env.local' };
    }

    // Create admin-privileged client
    const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        user_metadata: {
            full_name: payload.fullName,
            role: payload.role || 'staff',
        },
        email_confirm: true, // Auto-confirm email for immediate staff login
    });

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/admin');
    return { success: true, user: data.user };
}

export async function getStaffUsersAction() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) return [];

    const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) return [];
    return data.users || [];
}