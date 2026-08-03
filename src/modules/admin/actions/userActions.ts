'use server';

import { createClient as createAdminClient, type AdminUserAttributes } from '@supabase/supabase-js';
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

    revalidatePath('/admin', 'page');
    return { success: true, user: data.user };
}

export async function updateStaffUserAction(payload: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    password?: string;
}) {
    if (!payload.id || !payload.email || !payload.fullName) {
        return { success: false, message: 'User ID, Full Name, and Email are required.' };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!serviceRoleKey) {
        return { success: false, message: 'SUPABASE_SERVICE_ROLE_KEY is missing in .env.local' };
    }

    const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey);

    const updateAttributes: AdminUserAttributes = {
        email: payload.email,
        user_metadata: {
            full_name: payload.fullName,
            role: payload.role || 'staff',
        },
    };

    if (payload.password && payload.password.trim().length > 0) {
        updateAttributes.password = payload.password.trim();
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(payload.id, updateAttributes);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/admin', 'page');
    return { success: true, user: data.user };
}

export async function deleteStaffUserAction(id: string) {
    if (!id) return { success: false, message: 'User ID is required.' };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!serviceRoleKey) {
        return { success: false, message: 'SUPABASE_SERVICE_ROLE_KEY is missing in .env.local' };
    }

    const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey);

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/admin', 'page');
    return { success: true };
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