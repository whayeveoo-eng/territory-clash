# 领地炮战 TerritoryClash

竖屏霓虹风观赏型自动对战。棋盘由格子拼成，上下两方各有炮台自动开火；子弹飞入对方领域、把击中的第一个敌色格子转成己方色，前线来回拉锯；把前线推平、暴露并摧毁对方全部炮台者获胜。

灵感来自抖音买量广告截图（`未命名文件夹/IMG_0640.PNG`）的霓虹辉光风格与领地拉锯结构，玩法机制自定。

## 玩法一览

- 棋盘 `1080×1260`，`24×28` 格子，开局上半金 / 下半蓝。
- 每方 2 个固定炮台，有 HP，自动随机角度开火。
- 子弹命中第一个敌色格子→转色→消失，前线推进。
- 拉锯制：格子可被双方反复转化。
- momentum：领地越多开火越快，让 50/50 僵局加速分出胜负。
- 推平再暴露：炮台前方格子被清空后，子弹才能命中炮台扣血。
- 摧毁对方全部炮台获胜（设超时上限，超时按领地占比判胜）。
- 实测一局约 `72s`，0 平局，双方胜率均衡。

## 目录结构

```
TerritoryClash/
  index.html
  src/
    main.js
    core/   loop match grid physics damage stats events
    render/ arena cannons bullets effects ui
    data/   constants teams
    tests/
  docs/     design tech art test changelog
  assets/   images audio fonts
  tools/
```

## 在线试玩

🎮 **https://whayeveoo-eng.github.io/territory-clash/**

手机 / 电脑浏览器直接打开即玩，可分享。托管在 GitHub Pages（`whayeveoo-eng/territory-clash` 仓库，main 分支根目录）。

## 快速体验（本地）

从仓库根目录起本地服务，手机用局域网 IP 预览：

```bash
python3 -m http.server 8000
# 打开 http://192.168.x.x:8000/TerritoryClash/
```

控制台快速跑一局：

```js
__game.startMatch();
__game.step(60 * 60);
console.log(__game.getWinner(), __game.getStats());
```

详见 [docs/design.md](docs/design.md)、[docs/tech.md](docs/tech.md)。

## 更新线上版本

线上是从本目录单独抽出的小仓库（不含 31GB monorepo 的其它内容）。改完代码后重新发布：

```bash
# 把本目录最新内容同步到发布副本（排除参考图 / 系统文件 / dist）
rsync -a --delete --exclude='未命名文件夹' --exclude='.DS_Store' --exclude='dist' \
  TerritoryClash/ /tmp/territory-clash/
cd /tmp/territory-clash
git add -A && git commit -m "更新说明" && git push
# 推送后 GitHub Pages 自动重建，约 30s 生效
```

> GitHub Pages 走 https，ES module 可直接加载，**线上用的是模块化原版**，无需打包单文件。
> `dist/` 单文件版仅用于「离线 / AirDrop 发文件」场景，见下。

## 离线单文件版

```bash
node tools/build-standalone.mjs   # 生成 dist/index.html（约 24KB，零依赖）
```

`dist/index.html` 内联了全部 JS，可用 `file://` 直接打开 —— 适合 AirDrop 到手机离线玩（Android Chrome 直接开；iOS 需借助带浏览器的文件 App）。
