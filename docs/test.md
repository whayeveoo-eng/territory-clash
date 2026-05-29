# 领地炮战 TerritoryClash · 测试文档

## 功能冒烟测试

每次改动后至少确认：

- 页面可打开，无控制台报错。
- 点击开始后进入 `playing`。
- 炮台自动开火，子弹飞出。
- 子弹命中敌色格子会转色，前线发生可见推进。
- 双方来回拉锯，前线呈锯齿。
- 炮台前方推平后，子弹能命中炮台并扣血。
- 某方全部炮台被摧毁能结算，胜负文案正确。
- 重新开始能重置帧数、格子、炮台 HP、子弹与统计。

## 节奏测试

用 `window.__game` 脚本跑：

- 默认 matchup 5 局。
- 调参候选版本各 10 局。
- 重要版本 20-50 局。
- 支持 slot 互换后，互换至少 5 局；镜像局至少 5 局。

节奏统计至少输出：

| 指标 | 含义 |
| --- | --- |
| `durationSeconds` | 对局时长 |
| `cellsConvertedByTeam` | 各方累计转化格数 |
| `territoryShareSamples` | 领地占比随时间采样 |
| `cannonFirstHitFrame` | 首次炮台受击帧 |
| `cannonsDestroyed` | 各方炮台被摧毁数 |
| `winner` | 胜者 |
| `draws` | 平局或超时 |

## 视觉 QA

- 棋盘完整显示，格子与前线清楚。
- 转化闪光不糊成一片、不遮占比读数。
- 炮台摧毁爆破不遮结算信息。
- 手机竖屏比例下仍保持观赏重点在前线。

本地服务与手机预览遵循根目录 `README.md`，优先给局域网地址。

## 测试命令片段

```js
// 控制台快速跑一局
__game.startMatch();
__game.step(60 * 60);   // 快进 60 秒
console.log(__game.getWinner(), __game.getStats());
```
