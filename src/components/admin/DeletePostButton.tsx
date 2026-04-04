'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deletePost } from '@/app/actions/post-actions';

interface DeletePostButtonProps {
  postId: string;
  className?: string;
}

export default function DeletePostButton({ postId, className }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('本当にこの記事を削除しますか？')) {
      startTransition(async () => {
        const result = await deletePost(postId);
        if (!result.success) {
          alert('削除に失敗しました: ' + result.error);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isPending}
      className={className}
      style={{ 
        opacity: isPending ? 0.5 : 1,
        cursor: isPending ? 'not-allowed' : 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        display: 'flex',
        alignItems: 'center'
      }}
      title="削除"
    >
      <Trash2 size={16} />
    </button>
  );
}
