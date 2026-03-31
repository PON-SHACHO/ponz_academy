'use client';

import { adminLogout } from '@/app/actions/admin-auth';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton({ className }: { className?: string }) {
  return (
    <form action={adminLogout}>
      <button type="submit" className={className}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </form>
  );
}
