---
description: Next.js 16の新機能と使い方ガイド
---

# Next.js 16 スキルガイド

## バージョン情報

- **リリース日**: 2025年10月21日
- **現行バージョン**: Next.js 16.1 (2025年12月18日)
- **ステータス**: Active LTS (Long-Term Support)

## システム要件

- **Node.js**: 20.9以上（Node.js 18サポートは非推奨）
- **対応OS**: macOS, Windows (WSL含む), Linux
- **ブラウザ**: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+

## プロジェクト作成

### クイックスタート（推奨）

```bash
# 推奨デフォルトで作成（TypeScript, ESLint, Tailwind, App Router, Turbopack）
pnpm create next-app@latest my-app --yes
cd my-app
pnpm dev
```

### カスタム設定で作成

```bash
npx create-next-app@latest
```

プロンプトで以下を選択可能:

- TypeScript: Yes/No
- Linter: ESLint / Biome / None
- React Compiler: Yes/No（自動メモ化）
- Tailwind CSS: Yes/No
- src/ ディレクトリ: Yes/No
- App Router: Yes/No（推奨: Yes）
- インポートエイリアス: @/*

### 手動インストール

```bash
pnpm i next@latest react@latest react-dom@latest
```

## 主要な新機能

### 1. Turbopack（デフォルトバンドラー）

Next.js 16ではTurbopackがデフォルトのバンドラーに。

```bash
# Turbopack使用（デフォルト）
next dev
next build

# Webpackを使用したい場合
next dev --webpack
next build --webpack
```

**パフォーマンス向上**:

- 本番ビルド: 2-5倍高速化
- Fast Refresh: 最大10倍高速化
- ファイルシステムキャッシュ（β）: 起動・コンパイル時間の短縮

### 2. Cache Components

キャッシュ動作を明示的に制御可能。

```tsx
// app/components/CachedData.tsx
import { cache } from 'react'

export const getCachedData = cache(async (id: string) => {
  const res = await fetch(`/api/data/${id}`, {
    next: { revalidate: 3600 } // 1時間キャッシュ
  })
  return res.json()
})
```

### 3. React Compiler（安定版）

自動メモ化でuseCallback/useMemoが不要に。

```tsx
// react-compilerが自動でメモ化
function MyComponent({ items }) {
  // 手動のuseCallback/useMemo不要
  const handleClick = (id) => console.log(id)
  const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name))
  
  return <List items={sortedItems} onClick={handleClick} />
}
```

### 4. React 19.2統合

#### View Transitions

```tsx
'use client'
import { useViewTransition } from 'react'

export function AnimatedPage() {
  const { startTransition } = useViewTransition()
  
  return (
    <button onClick={() => startTransition(() => navigate('/next'))}>
      Next Page
    </button>
  )
}
```

#### useEffectEvent フック

```tsx
'use client'
import { useEffectEvent } from 'react'

function Logger({ value }) {
  const onLog = useEffectEvent((currentValue) => {
    console.log('Logged:', currentValue)
  })

  useEffect(() => {
    onLog(value)
  }, []) // valueが変わってもeffectは再実行されない
}
```

#### Activity コンポーネント

```tsx
import { Activity } from 'react'

function App() {
  return (
    <Activity mode="hidden">
      {/* バックグラウンドでプリレンダリング */}
      <HeavyComponent />
    </Activity>
  )
}
```

### 5. 改善されたキャッシュAPI

```tsx
import { revalidateTag, updateTag } from 'next/cache'

// タグベースの再検証
async function updateData() {
  await saveToDatabase()
  revalidateTag('user-data')
}

// タグの更新（新機能）
async function partialUpdate() {
  updateTag('user-data', { lastUpdated: Date.now() })
}
```

### 6. Proxy.ts（middleware.tsの後継）

軽量なリクエストプロキシ用。

```ts
// proxy.ts
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  // 軽量なリクエスト変換のみ
  const headers = new Headers(request.headers)
  headers.set('X-Custom-Header', 'value')
  
  return NextResponse.next({ headers })
}

export const config = {
  matcher: '/api/:path*',
}
```

### 7. ルーティング強化（安定版）

#### Parallel Routes

```
app/
├── @modal/
│   └── (.)photo/[id]/page.tsx
├── @sidebar/
│   └── page.tsx
└── layout.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
  sidebar,
}: {
  children: React.ReactNode
  modal: React.ReactNode
  sidebar: React.ReactNode
}) {
  return (
    <>
      {sidebar}
      {children}
      {modal}
    </>
  )
}
```

#### Intercepting Routes

```
app/
├── feed/
│   └── page.tsx
├── photo/[id]/
│   └── page.tsx
└── @modal/
    └── (.)photo/[id]/
        └── page.tsx  # フィード内モーダル表示
```

## ディレクトリ構造（推奨）

```
my-app/
├── app/
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   ├── (dashboard)/      # ルートグループ
│   │   ├── layout.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── api/
│       └── route.ts      # APIルート
├── components/
│   └── ui/               # 再利用可能コンポーネント
├── lib/
│   └── utils.ts          # ユーティリティ関数
├── public/               # 静的ファイル
├── next.config.ts        # Next.js設定
├── package.json
└── tsconfig.json
```

## package.json スクリプト

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

## next.config.ts

```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  // 実験的機能
  experimental: {
    // Turbopackファイルシステムキャッシュ（β）
    turboFilesystemCache: true,
  },
  
  // 画像最適化
  images: {
    remotePatterns: [
      { hostname: 'example.com' },
    ],
  },
}

export default config
```

## Vercel Cron Jobs設定

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/daily",
      "schedule": "0 0 * * *"
    }
  ]
}
```

```ts
// app/api/cron/daily/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Cron secret検証
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // バッチ処理
  await runDailyTasks()
  
  return NextResponse.json({ success: true })
}
```

## 参考リンク

- [Next.js 16 公式ドキュメント](https://nextjs.org/docs)
- [Next.js 16 リリースノート](https://nextjs.org/blog/next-16)
- [Turbopack ドキュメント](https://nextjs.org/docs/app/api-reference/turbopack)
