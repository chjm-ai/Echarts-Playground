# ECharts Playground

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![ECharts](https://img.shields.io/badge/echarts-5.4.3-orange.svg)

🌐 **在线访问**: [https://Echarts.chjm.cc](https://Echarts.chjm.cc)

一个可视化的 ECharts 图表样式调试工具，帮助设计师和开发者快速调试图表样式，并导出配置到自己的项目中。

## 📖 项目简介

ECharts Playground 是一个基于 React + ECharts 的在线图表配置工具。与官方配置方式（需要编写代码）不同，本项目提供了可视化的配置界面，让您可以通过简单的操作来调试图表样式，并一键导出配置 JSON，直接应用到您的项目中。

### 核心价值

- 🎨 **可视化配置**：无需编写代码，通过界面即可调整图表样式
- 📋 **一键导出**：快速导出配置 JSON，直接用于项目
- 🔄 **实时预览**：配置修改即时生效，所见即所得
- 📊 **多场景测试**：支持正常数据、大数据量、少数据量、多维度等场景
- 🎯 **专注样式**：专注于图表样式调试，提升开发效率

## ✨ 主要特性

- **可视化配置面板**：提供直观的配置界面，支持实时预览
- **通用配置 + 独立配置**：支持全局通用配置和每个图表的独立配置
- **多种数据场景**：内置多种数据场景，方便测试不同数据量下的图表表现
- **配置导出**：支持导出完整的 ECharts 配置 JSON
- **可拖拽布局**：支持拖拽调整图表位置和大小
- **响应式设计**：适配不同屏幕尺寸
- **主题支持**：支持多种内置主题和自定义主题

## 📊 支持的图表类型

目前支持以下图表类型（持续更新中）：

- ✅ 折线图 (Line Chart)
- ✅ 柱状图 (Bar Chart)
- ✅ 饼图 (Pie Chart)
- ✅ 散点图 (Scatter Chart)
- ✅ 雷达图 (Radar Chart)
- ✅ 堆叠柱状图 (Stacked Bar Chart)
- ✅ 横向条形图 (Horizontal Bar Chart)

> 💡 **计划中**：更多图表类型正在开发中，包括面积图、仪表盘、漏斗图、树状图等。

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/chjm-ai/Echarts-Playground.git

# 进入项目目录
cd Echarts-Playground

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:5173` 即可使用。

### 构建生产版本

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 📖 使用说明

### 基本使用

1. **选择图表**：在仪表板中选择要配置的图表
2. **调整配置**：通过配置面板调整图表样式
   - 通用配置：点击右上角设置按钮，配置所有图表共享的设置（如 tooltip、legend、坐标轴等）
   - 图表配置：点击图表右上角的配置按钮，配置该图表特有的样式
3. **切换数据场景**：使用顶部导航栏切换不同的数据场景，测试图表在不同数据量下的表现
4. **导出配置**：在配置面板中点击"复制配置"按钮，即可复制完整的 ECharts 配置 JSON

### 配置导出示例

导出的配置可以直接在您的项目中使用：

```javascript
import * as echarts from 'echarts';

const option = {
  // 这里是从 Playground 导出的配置
  tooltip: { ... },
  legend: { ... },
  xAxis: { ... },
  yAxis: { ... },
  series: [ ... ]
};

const chart = echarts.init(document.getElementById('chart'));
chart.setOption(option);
```

## 🎯 功能特性详解

### 通用配置

所有图表共享的配置项：

- **Tooltip（提示框）**：触发方式、背景色、边框、文字样式、指示器样式
- **Legend（图例）**：显示/隐藏、位置、方向、间距、文字样式
- **Grid（网格）**：显示背景、边距设置
- **坐标轴**：标签样式、轴线样式、网格线样式
- **标题**：主标题、副标题、位置、样式

### 图表独立配置

每个图表类型都有其特有的配置项，例如：

**折线图**：
- 平滑曲线、线条宽度、线条类型、线条颜色
- 数据点显示、数据点形状和大小
- 区域填充、阶梯线、堆叠
- 标签位置和样式

**柱状图**：
- 圆角、柱宽、柱间距
- 标签位置和样式

**饼图**：
- 标签位置、引导线样式
- 圆角、中心位置、半径
- 玫瑰图模式、起始角度

更多配置项请在实际使用中探索。

### 数据场景

内置 4 种数据场景，方便测试：

- **正常数据**：标准的数据量和维度
- **数据非常多**：测试大数据量下的图表表现
- **数据非常少**：测试少量数据下的图表表现
- **维度特别多**：测试多维度数据下的图表表现

## 🛠️ 技术栈

- **React 18.2.0** - UI 框架
- **ECharts 5.4.3** - 图表库
- **echarts-for-react 3.0.2** - React ECharts 封装
- **react-grid-layout 1.5.3** - 可拖拽网格布局
- **Vite 5.0.8** - 构建工具
- **Lucide React** - 图标库

## 📁 项目结构

```
echarts-playground/
├── src/
│   ├── components/          # 组件目录
│   │   ├── charts/          # 图表组件
│   │   │   ├── LineChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   ├── PieChart.jsx
│   │   │   └── ...
│   │   ├── Dashboard.jsx    # 主仪表板
│   │   ├── ConfigSidebar.jsx # 通用配置侧边栏
│   │   ├── ChartConfigPanel.jsx # 图表配置面板
│   │   └── ...
│   ├── config/              # 配置文件
│   │   ├── chartDefaults.js # 图表默认配置
│   │   ├── colors.js        # 颜色配置
│   │   └── themes.js        # 主题配置
│   ├── data/                # 数据文件
│   │   └── scenarios.js     # 数据场景
│   ├── utils/               # 工具函数
│   │   └── configMerge.js   # 配置合并工具
│   └── context/             # React Context
│       └── ThemeContext.jsx # 主题上下文
├── index.html
├── package.json
└── vite.config.js
```

## 🗺️ 开发计划

### 近期计划

- [ ] 支持更多图表类型（面积图、仪表盘、漏斗图等）
- [ ] 配置预设管理（保存、加载、分享配置预设）
- [ ] 配置导入功能（支持导入已有配置进行编辑）
- [ ] 更多主题支持
- [ ] 配置验证和错误提示

### 长期计划

- [ ] 支持自定义数据源
- [ ] 配置模板市场
- [ ] 多语言支持
- [ ] 性能优化
- [ ] 单元测试和 E2E 测试

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细的贡献指南。

### 快速开始

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献方向

- 🐛 修复 Bug
- ✨ 添加新功能
- 📝 完善文档
- 🎨 优化 UI/UX
- ⚡ 性能优化
- 🌍 国际化支持

## 📝 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Apache ECharts](https://echarts.apache.org/) - 强大的图表库
- [React](https://react.dev/) - 优秀的 UI 框架
- [Vite](https://vitejs.dev/) - 快速的构建工具

## 📮 反馈与建议

如果您有任何问题、建议或反馈，欢迎：

- 提交 [Issue](https://github.com/chjm-ai/Echarts-Playground/issues)
- 开启 [Discussion](https://github.com/chjm-ai/Echarts-Playground/discussions)

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！

