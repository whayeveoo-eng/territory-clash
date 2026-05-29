# 领地炮战 TerritoryClash · 技术文档

## 技术选型

- 纯前端：单 `index.html` + ES Module + Canvas 2D，无构建工具，沿用仓库模块化原型约定。
- 固定逻辑步长（`1/60s`），渲染走 `requestAnimationFrame`。
- 确定性优先：子弹移动、格子转化、炮台命中都可在固定步长下复现，便于节奏测试。

## 模块职责

| 模块 | 职责 |
| --- | --- |
| `src/main.js` | 页面启动、Canvas 初始化、对象装配、挂载 `window.__game` |
| `src/core/loop.js` | 固定步长循环、暂停、恢复、单步 `step(frames)` |
| `src/core/match.js` | 对局状态、初始化、炮台/格子布局、胜负与超时判定 |
| `src/core/grid.js` | 格子领地系统：owner 存储、坐标↔格子换算、转化、按队伍计数 |
| `src/core/physics.js` | 子弹移动、左右墙反弹、命中格子转化、命中炮台 |
| `src/core/damage.js` | 炮台 HP 扣减、摧毁判定、伤害事件 |
| `src/core/stats.js` | 局长、转化次数、炮台受击/摧毁、领地占比采样 |
| `src/core/events.js` | 极简事件总线 `on/emit`，供特效、统计、后续系统监听 |
| `src/render/arena.js` | 背景、格子棋盘、前线高亮 |
| `src/render/cannons.js` | 炮台绘制、HP、炮口朝向 |
| `src/render/bullets.js` | 子弹绘制、辉光拖尾 |
| `src/render/effects.js` | 转化闪光、炮台命中粒子、摧毁、胜利氛围 |
| `src/render/ui.js` | 菜单、开始按钮、领地条 HUD、结算层 |
| `src/data/constants.js` | 棋盘尺寸、格子、炮台、子弹参数、FEATURE_FLAGS |
| `src/data/teams.js` | 两方颜色、出生侧、炮台布局、视觉配置 |

## 关键数据结构

```js
// 格子领地：用一维 Uint8Array 存 owner，0=top 方，1=bottom 方
grid = { cols, rows, cellSize, cells: Uint8Array(cols*rows) }

// 炮台
cannon = { id, team, x, y, hp, maxHp, fireCooldown, alive, aimDir }

// 子弹
bullet = { team, x, y, vx, vy, alive }
```

## 子弹—格子—炮台判定顺序（每帧每弹）

1. 按 `vx,vy` 推进位置（速度 < 格子边长，避免穿格）。
2. 左右出界：反弹；上下出界：标记死亡。
3. 取当前所在格 `(col,row)`：
   - 该格 owner == 子弹 team（己方色）→ 穿过。
   - 该格 owner == 敌方 → `grid.convert(col,row,team)`，`emit('cellConverted')`，子弹死亡。
4. 命中敌方炮台（圆碰撞且该炮台 alive）→ `damageCannon(-1)`，子弹死亡。
   - 因第 3 步会先在前线把子弹拦下，只有护甲被推平后子弹才会走到这一步，天然实现「推平再暴露」。

## momentum（动态平衡）

`physics.updateCannons` 在每次开火后按己方领地占比缩放下次开火间隔：`间隔系数 = clamp(1 − k·lead, min, max)`，`lead = (share−0.5)·2`。参数在 `data/constants.js` 的 `CANNON.momentum`。这是为破解对称僵局加入的正反馈，详见 [docs/design.md](design.md)「动态平衡」与 [docs/changelog.md](changelog.md) v0.1.0 节奏分析。

## 事件管线

```js
emit('matchStarted', { matchConfig })
emit('bulletFired', { team, x, y })
emit('cellConverted', { team, col, row, x, y })
emit('cannonHit', { cannon, amount })
emit('cannonDestroyed', { cannon })
emit('matchEnded', { winner, loser, frame, reason })
```

## 测试钩子

```js
window.__game = {
  startMatch(matchConfig, options),
  step(frames),
  getState(),
  getFrame(),
  getWinner(),
  getStats(),
  getGrid(),        // { cols, rows, cells, countByTeam }
  getCannons(),
  getBullets(),
};
```

目标是让脚本稳定跑多局并输出节奏统计，不区分玩家用途。

## 运行方式

从仓库根目录起本地服务，手机预览用局域网 IP：

```bash
python3 -m http.server 8000
# 打开 http://192.168.x.x:8000/TerritoryClash/
```
