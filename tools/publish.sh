#!/usr/bin/env bash
# 把 TerritoryClash 当前内容发布到 GitHub Pages。
# 用法: bash tools/publish.sh ["提交说明"]
#
# 原理: 每次都临时克隆一份线上仓库 → 用本地开发源覆盖 → 提交并推送。
# 不依赖任何常驻副本，/tmp 被清空也不影响。
set -euo pipefail

MSG="${1:-update: 同步最新改动}"
SRC="$(cd "$(dirname "$0")/.." && pwd)"   # = TerritoryClash 开发源目录
REPO="whayeveoo-eng/territory-clash"
PAGES="https://whayeveoo-eng.github.io/territory-clash/"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "→ 克隆线上仓库到临时目录..."
gh repo clone "$REPO" "$WORK" -- -q

echo "→ 用本地开发源同步(排除 .git / 参考图 / 系统文件 / dist)..."
rsync -a --delete \
  --exclude='.git' --exclude='未命名文件夹' --exclude='.DS_Store' --exclude='dist' \
  "$SRC"/ "$WORK"/

cd "$WORK"
git add -A
if git diff --cached --quiet; then
  echo "✓ 线上已是最新，无改动可推。"
  exit 0
fi
git commit -q -m "$MSG"
git push -q origin main
echo "✓ 已推送。GitHub Pages 约 30s 后更新："
echo "  $PAGES"
