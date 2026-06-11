# 发布新版本（维护者指南）

回答两个核心问题：**我怎么推送更新？别人怎么收到？**

## 一次性准备

1. 在 GitHub 建一个仓库（如 `windcatcher`），把代码推上去。
2. 把以下两处的 `YOUR_GITHUB_USERNAME` 改成你的 GitHub 用户名：
   - `package.json` → `build.publish.owner` 与 `repository.url`、`homepage`
   - `README.md` 里的下载链接
3. 确认 `.gitignore` 已排除 `data/`（**你的 DeepSeek Key 在里面，绝不能入库**）与 `dist/`。

## 方式 A：GitHub Actions 自动发布（推荐，无需本地构建）

已内置 `.github/workflows/release.yml`。流程：

```bash
# 1. 改版本号
npm version patch        # 0.1.0 → 0.1.1（或 minor / major）
# 2. 推送代码与 tag
git push && git push --tags
```

推送 `v*` tag 后，GitHub Actions 会在 Windows runner 上自动构建并把
安装包 + `latest.yml` 发布到 Releases。用的是仓库自带的 `GITHUB_TOKEN`，**无需额外密钥**。

## 方式 B：本地构建后发布

```bash
# 需要一个有 repo 权限的 GitHub Personal Access Token
export GH_TOKEN=ghp_xxxxx        # Windows PowerShell: $env:GH_TOKEN="ghp_xxxxx"
# 大陆网络首次构建经镜像拉构建资源
export ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
npm version patch
npm run release                  # 构建并发布到 GitHub Releases
```

只想本地出个安装包、先不发布：`npm run dist`（产物在 `dist/`）。

## 别人怎么收到更新？

完全自动，你什么都不用通知：

1. 用户已安装的 app **每次启动**（以及之后每 6 小时）会去你的 GitHub Releases 查 `latest.yml`。
2. 发现版本比本地新 → **后台静默下载**安装包。
3. 下载完，应用右上角出现 **「▲ 重启安装 vX.Y.Z」**，用户点一下就升级完成。

> 要点：electron-updater 靠对比 `latest.yml` 里的版本号判断更新，所以**每次发布务必 `npm version` 抬高版本号**，否则用户端不会触发更新。

## 版本号约定

`主.次.补丁`：修 bug → patch；加功能 → minor；不兼容改动 → major。
