'use client';

import { useState } from 'react';
import { updateUserRole, deleteUser } from '@/app/actions/user-actions';
import { Trash2, Loader2, MoreVertical, ShieldCheck, User } from 'lucide-react';
import styles from './page.module.css';

type UserData = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

export default function UserTable({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingId(userId);
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      alert(result.error);
    }
    setLoadingId(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('本当にこのユーザーを削除しますか？')) return;
    
    setLoadingId(userId);
    const result = await deleteUser(userId);
    if (result.success) {
      setUsers(users.filter(u => u.id !== userId));
    } else {
      alert(result.error);
    }
    setLoadingId(null);
  };

  const getInitial = (name: string | null, email: string) => {
    if (name) return name.charAt(0).toUpperCase();
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>IDENTITY</th>
            <th>EMAIL</th>
            <th>CURRENT ROLE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.identityCell}>
                  <div className={`${styles.avatar} ${user.role === 'ADMIN' ? styles.avatarAdmin : ''}`}>
                    {getInitial(user.name, user.email)}
                  </div>
                  <div>
                    <div className={styles.userName}>{user.name || 'Unknown User'}</div>
                    <div className={styles.joinedDate}>
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </td>
              <td className={styles.emailCell}>
                {user.email}
              </td>
              <td>
                <div className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.roleBadgeAdmin : ''}`}>
                  {user.role}
                </div>
              </td>
              <td className={styles.actionsCell}>
                {loadingId === user.id ? (
                  <Loader2 size={16} className={styles.spin} />
                ) : (
                  <div className={styles.actionGroup}>
                    <select 
                      className={styles.roleSelect}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="MEMBER">MEMBER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button onClick={() => handleDelete(user.id)} className={styles.deleteBtn}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className={styles.emptyState}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
