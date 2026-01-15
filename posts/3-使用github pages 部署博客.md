---
id: "1"
title: '使用github pages 部署博客'
date: '2025-11-03'
excerpt: '使用github pages 部署博客'
tags: ['github pages', '博客']
---
## 使用github pages 部署博客

使用github pages 部署博客的步骤如下：
1. 在github上创建一个新的repository，命名为 `username.github.io`，其中 `username` 是你的github用户名。
2. 将博客项目的代码推送到这个repository。
3. 在repository的settings中，找到github pages部分，选择github Build and deployment Status为 github Actions。
4. 编写github yaml文件，内容如下：
```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
4. 等待github pages部署完成，访问 `https://username.github.io/repository_name/` 即可查看博客。
