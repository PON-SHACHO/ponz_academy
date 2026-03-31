---
description: Prisma 7 の新機能、破壊的変更、および移行ガイド
---

# Prisma 7 ガイド

2026年現在、Prisma 7 は大幅なアーキテクチャの変更（Rust エンジンから WebAssembly への移行）と、Next.js や ESM 環境への最適化が行われています。

## 1. 主要な変更点

### Rust エンジンの廃止 (Rust-free Engine)

Prisma Client は TypeScript + WebAssembly ランタイムを採用しました。

- **効果**: バンドルサイズが 90% 削減、クエリ速度が最大 3 倍向上、コールドスタートの改善。
- **要件**: Node.js 20.19+ (22+ 推奨)、TypeScript 5.4+ (5.9+ 推奨)。

### `prisma.config.ts` の導入

Prisma CLI の設定（DB URL、スキーマ場所、シード設定など）を一括管理するファイルです。`schema.prisma` から `url` が削除されました。

### ESM デフォルト化

Prisma 7 は ESM (ES Modules) として配布されます。

- `package.json` に `"type": "module"` が必須。
- `tsconfig.json` の設定（`moduleResolution: "bundler"` または `"node16/nodenext"`）に注意。

## 2. スキーマの更新 (`schema.prisma`)

`generator` ブロックと `datasource` ブロックの記述が変わりました。

```prisma
generator client {
  provider = "prisma-client" // "prisma-client-js" から変更
  output   = "./generated/client" // 必須。node_modules の外を推奨
}

datasource db {
  provider = "postgresql"
  // url はここには書かない（prisma.config.ts で管理）
}
```

## 3. 設定ファイルの作成 (`prisma.config.ts`)

プロジェクトルートに作成します。

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

## 4. Prisma Client のインスタンス化

**ドライバーアダプターが必須**になりました。

```typescript
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

## 5. コマンドの動作変更

- `prisma generate` は `migrate` コマンドなどで自動実行されなくなりました。明示的に実行する必要があります。
- 以前の `--skip-generate` フラグなどは削除されました。

## 6. 移行チェックリスト

1. [ ] `package.json` に `"type": "module"` を追加。
2. [ ] `prisma` と `@prisma/client` を `^7.0.0` に更新。
3. [ ] `schema.prisma` の `provider` を `"prisma-client"` に変更し、`output` を指定。
4. [ ] `prisma.config.ts` を作成し、環境変数を設定。
5. [ ] 必要に応じて各種ドライバーアダプター（`@prisma/adapter-pg` 等）をインストール。
6. [ ] `PrismaClient` の初期化コードをアダプター形式に書き換え。
7. [ ] `npx prisma generate` を実行。
