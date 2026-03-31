'use client';

import { memberLogout } from '@/app/actions/member-auth';
import { LogOut } from 'lucide-react';

export default function MemberLogoutButton({ className }: { className?: string }) {
  return (
    <form action={memberLogout}>
      <button type="submit" className={className}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </form>
  );
}
