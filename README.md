# Kiroku

![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=flat&logo=kotlin&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=springboot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

Notion に着想を得たページ・ブロック構造を持つドキュメント管理 Web アプリケーションです。

**Everything is Block** という設計思想を軸に、拡張性・保守性を意識して設計しています。

---

## 🚀 Demo

**ゲストモード（ログイン不要で試せます）**

**https://kiroku-demo.vercel.app/guest**

現状はフロントエンドのみ Vercel にデプロイしています。

バックエンドは未デプロイのため、ログインやサーバー側でのデータ保存は行えませんが、LocalStorage ベースのゲストモードで機能をお試しいただけます。

---

## 📷 Screenshot

<img width="1011" height="647" alt="kiroku-demo-main-page" src="https://github.com/user-attachments/assets/05b60b29-3825-4254-9024-3d3680f14882" />

---

## 🛠 技術スタック

### Backend

| 分類         | 技術                            |
| ---------- | ----------------------------- |
| Language   | Kotlin                        |
| Framework  | Spring Boot                   |
| Security   | Spring Security, JWT (jjwt)   |
| Database   | PostgreSQL, Flyway            |
| Cache      | Redis                         |
| Build      | Gradle (Kotlin DSL)           |
| Runtime    | Docker                        |

### Frontend

| 分類            | 技術                     |
| ------------- | ---------------------- |
| Framework     | Next.js (App Router)   |
| Language      | TypeScript              |
| Styling       | Tailwind CSS            |
| Server State  | TanStack Query           |
| Form          | React Hook Form + Zod    |
| Client State  | Zustand                  |

---

## 🐳 起動方法

```bash
git clone https://github.com/leedevjp/kiroku.git
cd kiroku
docker compose up
```

起動後、ブラウザで **http://localhost:3000** にアクセスしてください。

---

## 🏗 ディレクトリ構成

```text
kiroku/
├── backend/
│   ├── auth/
│   ├── user/
│   ├── workspace/
│   ├── block/
│   └── global/
├── frontend/
│   ├── app/
│   ├── features/
│   └── lib/
└── docker-compose.yml
```

- Backend: Spring Boot による REST API
- Frontend: Next.js (App Router)
- Database: PostgreSQL
- Cache: Redis
- 開発環境: Docker Compose

---

## 💡 技術的な意思決定

実装を進める中でいくつかの設計案を比較検討し、主要な意思決定は ADR（Architecture Decision Record）として記録しています。

### ADR-001. Everything is Block

Page と Block を別モデルに分けず、単一の Block モデルに統合しました。

これにより、作成・移動・削除・復元といった大半の操作を、一貫したデータモデル上で扱えるように設計しています。

**Trade-off**

* 一部のバリデーションはアプリケーション層で担保
* JSONB ベースの属性は通常のカラムより型安全性が低下する

---

### ADR-002. Position Key

ドラッグ&ドロップによる並び替えでは、連番の `sort_order` ではなく文字列ベースの Position Key を採用しました。

大半の順序変更を、1 レコードの更新のみで処理できます。

**Trade-off**

* Position Key の生成・再採番ロジックが別途必要
* 並び順の整合性がサーバー側のキー生成ロジックに依存する

---

### ADR-003. O(1) Trash

Trash への移動時、配下の Block をすべて更新するのではなく、対象の Block だけを Trash 状態に変更します。

取得時には Ancestor Walk（祖先を辿る探索）で上位 Block の状態を確認することで、削除コストを Subtree のサイズに依存しない **O(1)** に抑えています。

**Trade-off**

* 取得時に祖先 Block を辿る追加コストが発生する
* ツリー規模が大きくなった場合はさらなる最適化が必要
