'use client';

import { useState } from 'react';
import { updateUserRole, deleteUser, updateUserProfile } from '@/app/actions/user-actions';
import { Trash2, Loader2, Edit3, Check, X } from 'lucide-react';
import styles from './page.module.css';

type UserData = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

export default function UserTable({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

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

  const handleUpdateProfile = async (userId: string) => {
    setLoadingId(userId);
    const result = await updateUserProfile(userId, { name: editName, bio: editBio, avatarUrl: editAvatarUrl });
    if (result.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, name: editName, bio: editBio, avatarUrl: editAvatarUrl } : u));
      setEditId(null);
    } else {
      alert(result.error);
    }
    setLoadingId(null);
  };

  const startEdit = (user: UserData) => {
    setEditId(user.id);
    setEditName(user.name || '');
    setEditBio(user.bio || '');
    setEditAvatarUrl(user.avatarUrl || '');
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
            <th>IDENTITY & BIO</th>
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
                    {user.avatarUrl ? (
                       <img src={user.avatarUrl} alt="" className={styles.avatarImg} />
                    ) : (
                      getInitial(user.name, user.email)
                    )}
                  </div>
                  {editId === user.id ? (
                    <div className={styles.editFields}>
                      <input 
                        className={styles.editInput}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="氏名を入力"
                      />
                      <input 
                        className={styles.editInput}
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="肩書き/バイオを入力"
                      />
                      <input 
                        className={styles.editInput}
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                        placeholder="アバター画像URLまたは種別"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className={styles.userName}>{user.name || 'Unknown User'}</div>
                      <div className={styles.userBio}>{user.bio || '肩書き未設定'}</div>
                    </div>
                  )}
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
                ) : editId === user.id ? (
                   <div className={styles.actionGroup}>
                      <button onClick={() => handleUpdateProfile(user.id)} className={styles.saveBtn}>
                        <Check size={18} />
                      </button>
                      <button onClick={() => setEditId(null)} className={styles.cancelBtn}>
                        <X size={18} />
                      </button>
                   </div>
                ) : (
                  <div className={styles.actionGroup}>
                    <button onClick={() => startEdit(user)} className={styles.editBtn}>
                      <Edit3 size={16} />
                    </button>
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
