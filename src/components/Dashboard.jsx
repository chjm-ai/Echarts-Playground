import React, { useState, useEffect, useRef } from 'react'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Activity, 
  Hexagon, 
  Layers, 
  AlignLeft,
  GripVertical
} from 'lucide-react'

import LineChart from './charts/LineChart'
import BarChart from './charts/BarChart'
import PieChart from './charts/PieChart'
import ScatterChart from './charts/ScatterChart'
import RadarChart from './charts/RadarChart'
import StackedBarChart from './charts/StackedBarChart'
import HorizontalBarChart from './charts/HorizontalBarChart'
import ConfigSidebar from './ConfigSidebar'
import ChartConfigPanel from './ChartConfigPanel'
import ThemeSelector from './ThemeSelector'
import PresetManager from './PresetManager'
import { useTheme } from '../context/ThemeContext'
import { dataScenarios } from '../data/scenarios'
import { defaultCommonConfig, defaultChartConfigs } from '../config/chartDefaults'
import './Dashboard.css'

function Dashboard() {
  const { currentTheme, changeTheme } = useTheme()
  const [currentScenario, setCurrentScenario] = useState('normal')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [configuringChartId, setConfiguringChartId] = useState(null) // 当前正在配置的图表ID
  
  // 通用配置（所有图表共用）
  const [commonConfig, setCommonConfig] = useState(defaultCommonConfig)
  
  // 各图表的独立配置（切换数据场景时保持不变）
  const [chartConfigs, setChartConfigs] = useState({
    line: defaultChartConfigs.lineChart,
    bar: defaultChartConfigs.barChart,
    pie: defaultChartConfigs.pieChart,
    scatter: defaultChartConfigs.scatterChart,
    radar: defaultChartConfigs.radarChart,
    stacked: defaultChartConfigs.stackedBarChart,
    horizontal: defaultChartConfigs.horizontalBarChart
  })
  
  // 临时配置（配置模式下的配置，保存后才应用到实际配置）
  const [tempConfig, setTempConfig] = useState(null)
  const [configPreviewSize, setConfigPreviewSize] = useState(null)
  
  const scenarios = [
    { key: 'normal', label: '正常数据' },
    { key: 'many', label: '数据非常多' },
    { key: 'few', label: '数据非常少' },
    { key: 'dimensions', label: '维度特别多' }
  ]
  
  const currentData = dataScenarios[currentScenario]
  
  // 更新图表配置
  const handleChartConfigChange = (chartId, newConfig) => {
    setChartConfigs({
      ...chartConfigs,
      [chartId]: newConfig
    })
  }
  
  // 打开配置模式
  const handleOpenConfig = (chartId) => {
    setTempConfig(chartConfigs[chartId])
    setConfiguringChartId(chartId)
    setConfigPreviewSize(calculatePreviewSize(chartId))
  }
  
  // 保存配置
  const handleSaveConfig = () => {
    if (configuringChartId && tempConfig) {
      handleChartConfigChange(configuringChartId, tempConfig)
    }
    setConfiguringChartId(null)
    setTempConfig(null)
    setConfigPreviewSize(null)
  }
  
  // 取消配置
  const handleCancelConfig = () => {
    setConfiguringChartId(null)
    setTempConfig(null)
    setConfigPreviewSize(null)
  }
  
  // 更新临时配置
  const handleTempConfigChange = (newConfig) => {
    setTempConfig(newConfig)
  }

  // 加载方案
  const handleLoadPreset = (preset) => {
    if (preset.theme) {
      changeTheme(preset.theme)
    }
    if (preset.commonConfig) {
      setCommonConfig(preset.commonConfig)
    }
    if (preset.chartConfigs) {
      setChartConfigs(preset.chartConfigs)
    }
    if (preset.layout) {
      setLayout(preset.layout)
    }
  }

  // 初始布局配置（每个图表的位置和大小）
  // GridLayout 使用网格单位，默认每列 12 个单位
  const [layout, setLayout] = useState([
    { i: 'line', x: 0, y: 0, w: 6, h: 3, minW: 4, minH: 2 },
    { i: 'bar', x: 6, y: 0, w: 6, h: 3, minW: 4, minH: 2 },
    { i: 'pie', x: 0, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'scatter', x: 4, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'radar', x: 8, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'stacked', x: 0, y: 6, w: 6, h: 3, minW: 4, minH: 2 },
    { i: 'horizontal', x: 6, y: 6, w: 6, h: 3, minW: 4, minH: 2 }
  ])

  const [gridWidth, setGridWidth] = useState(1200)
  const gridWrapperRef = useRef(null)

  // 动态计算网格宽度
  useEffect(() => {
    const updateWidth = () => {
      if (gridWrapperRef.current) {
        const width = gridWrapperRef.current.offsetWidth - 48 // 减去 padding
        setGridWidth(Math.max(800, width)) // 最小宽度 800px
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // 计算配置全屏时左侧预览区域的宽高，尽量保持与 dashboard 中的尺寸一致
  // 使用与 GridLayout 相同的参数：cols=12, rowHeight=150, margin=[24,24]
  const calculatePreviewSize = (chartId) => {
    const layoutItem = layout.find(item => item.i === chartId)
    if (!layoutItem) return null

    const cols = 12
    const rowHeight = 150
    const marginX = 24  // GridLayout margin 的第二个值
    const marginY = 24  // GridLayout margin 的第一个值
    // react-grid-layout 的单列宽度算法：剔除间距后平均分列
    const colWidth = (gridWidth - marginX * (cols - 1)) / cols
    const width = colWidth * layoutItem.w + marginX * (layoutItem.w - 1)
    const height = rowHeight * layoutItem.h + marginY * (layoutItem.h - 1)

    return {
      width: Math.round(width),
      height: Math.round(height)
    }
  }

  // 当窗口大小或布局变化时，更新预览尺寸
  useEffect(() => {
    if (configuringChartId) {
      const newSize = calculatePreviewSize(configuringChartId)
      if (newSize) {
        setConfigPreviewSize(newSize)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridWidth, layout, configuringChartId])

  const chartTypes = {
    line: 'lineChart',
    bar: 'barChart',
    pie: 'pieChart',
    scatter: 'scatterChart',
    radar: 'radarChart',
    stacked: 'stackedBarChart',
    horizontal: 'horizontalBarChart'
  }

  const getChartIcon = (type) => {
    switch (type) {
      case chartTypes.line: return <LineChartIcon size={20} />;
      case chartTypes.bar: return <BarChart3 size={20} />;
      case chartTypes.pie: return <PieChartIcon size={20} />;
      case chartTypes.scatter: return <Activity size={20} />;
      case chartTypes.radar: return <Hexagon size={20} />;
      case chartTypes.stacked: return <Layers size={20} />;
      case chartTypes.horizontal: return <AlignLeft size={20} />;
      default: return <BarChart3 size={20} />;
    }
  };

  const charts = [
    { 
      id: 'line', 
      title: '折线图 - 销售趋势', 
      type: chartTypes.line,
      component: <LineChart 
        key={`line-${currentScenario}`} 
        data={currentData.lineChart}
        commonConfig={commonConfig}
        config={chartConfigs.line}
      /> 
    },
    { 
      id: 'bar', 
      title: '柱状图 - 季度对比', 
      type: chartTypes.bar,
      component: <BarChart 
        key={`bar-${currentScenario}`} 
        data={currentData.barChart}
        commonConfig={commonConfig}
        config={chartConfigs.bar}
      /> 
    },
    { 
      id: 'pie', 
      title: '饼图 - 产品分布', 
      type: chartTypes.pie,
      component: <PieChart 
        key={`pie-${currentScenario}`} 
        data={currentData.pieChart}
        commonConfig={commonConfig}
        config={chartConfigs.pie}
      /> 
    },
    { 
      id: 'scatter', 
      title: '散点图 - 数据分布', 
      type: chartTypes.scatter,
      component: <ScatterChart 
        key={`scatter-${currentScenario}`} 
        data={currentData.scatterChart}
        commonConfig={commonConfig}
        config={chartConfigs.scatter}
      /> 
    },
    { 
      id: 'radar', 
      title: '雷达图 - 产品评估', 
      type: chartTypes.radar,
      component: <RadarChart 
        key={`radar-${currentScenario}`} 
        data={currentData.radarChart}
        commonConfig={commonConfig}
        config={chartConfigs.radar}
      /> 
    },
    { 
      id: 'stacked', 
      title: '堆叠柱状图 - 分类统计', 
      type: chartTypes.stacked,
      component: <StackedBarChart 
        key={`stacked-${currentScenario}`} 
        data={currentData.stackedBarChart}
        commonConfig={commonConfig}
        config={chartConfigs.stacked}
      /> 
    },
    { 
      id: 'horizontal', 
      title: '横向条形图 - 销售排行', 
      type: chartTypes.horizontal,
      component: <HorizontalBarChart 
        key={`horizontal-${currentScenario}`} 
        data={currentData.horizontalBarChart}
        commonConfig={commonConfig}
        config={chartConfigs.horizontal}
      /> 
    }
  ]

  // 如果正在配置某个图表，显示全屏配置模式
  if (configuringChartId) {
    const configuringChart = charts.find(ch => ch.id === configuringChartId)
    if (configuringChart && tempConfig) {
      // 创建配置模式下的图表组件
      const ConfigChartComponent = () => {
        switch (configuringChart.type) {
          case 'lineChart':
            return <LineChart data={currentData.lineChart} commonConfig={commonConfig} config={tempConfig} />
          case 'barChart':
            return <BarChart data={currentData.barChart} commonConfig={commonConfig} config={tempConfig} />
          case 'pieChart':
            return <PieChart data={currentData.pieChart} commonConfig={commonConfig} config={tempConfig} />
          case 'scatterChart':
            return <ScatterChart data={currentData.scatterChart} commonConfig={commonConfig} config={tempConfig} />
          case 'radarChart':
            return <RadarChart data={currentData.radarChart} commonConfig={commonConfig} config={tempConfig} />
          case 'stackedBarChart':
            return <StackedBarChart data={currentData.stackedBarChart} commonConfig={commonConfig} config={tempConfig} />
          case 'horizontalBarChart':
            return <HorizontalBarChart data={currentData.horizontalBarChart} commonConfig={commonConfig} config={tempConfig} />
          default:
            return null
        }
      }
      
      return (
        <div className="dashboard-fullscreen-container">
          <ChartConfigPanel
            chartId={configuringChartId}
            chartType={configuringChart.type}
            chartTitle={configuringChart.title}
            config={tempConfig}
            onConfigChange={handleTempConfigChange}
            onSave={handleSaveConfig}
            onCancel={handleCancelConfig}
            chartComponent={<ConfigChartComponent />}
            isFullScreen={true}
            previewSize={configPreviewSize}
            // 传递计算参数，用于响应式更新
            previewLayoutParams={{
              gridWidth,
              layoutItem: layout.find(item => item.i === configuringChartId),
              cols: 12,
              rowHeight: 150,
              marginX: 24,
              marginY: 24
            }}
          />
        </div>
      )
    }
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="logo-icon">
              <LayoutDashboard size={24} color="white" />
            </div>
            <h1 className="navbar-title">ECharts Playground</h1>
            
            <PresetManager
              currentTheme={currentTheme}
              commonConfig={commonConfig}
              chartConfigs={chartConfigs}
              layout={layout}
              onLoadPreset={handleLoadPreset}
            />
          </div>
          
          <div className="navbar-controls">
            <ThemeSelector />
            
            <div className="scenario-selector">
              <button className="scenario-selector-button">
                <span className="scenario-selector-label">数据场景</span>
                <span className="scenario-selector-current">
                  {scenarios.find(s => s.key === currentScenario)?.label || '正常数据'}
                </span>
                <svg
                  className="scenario-selector-arrow"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 4L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <select 
                  value={currentScenario} 
                  onChange={(e) => setCurrentScenario(e.target.value)}
                  className="scenario-selector-hidden-select"
                >
                  {scenarios.map(scenario => (
                    <option key={scenario.key} value={scenario.key}>
                      {scenario.label}
                    </option>
                  ))}
                </select>
              </button>
            </div>
            
            <button 
              className={`config-toggle-button ${sidebarOpen ? 'active' : ''}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Settings size={18} />
              <span>通用配置</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 配置侧边栏 */}
      <ConfigSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        commonConfig={commonConfig}
        onConfigChange={setCommonConfig}
      />
      
      <div className="dashboard-content">
        <div className="dashboard-grid-wrapper" ref={gridWrapperRef}>
        <GridLayout
          className="layout"
          layout={layout}
          onLayoutChange={setLayout}
          cols={12}
          rowHeight={150}
          width={gridWidth}
          isDraggable={true}
          isResizable={true}
          draggableHandle=".chart-drag-handle"
          margin={[24, 24]}
          compactType="vertical"
        >
          {charts.map(chart => (
            <div key={chart.id} className="chart-card">
              <div className="chart-header">
                <div className="chart-title-wrapper chart-drag-handle">
                  <GripVertical size={16} className="drag-icon" />
                  {getChartIcon(chart.type)}
                  <h2 className="chart-title">{chart.title}</h2>
                </div>
                <ChartConfigPanel
                  chartId={chart.id}
                  chartType={chart.type}
                  config={chartConfigs[chart.id]}
                  onConfigChange={(newConfig) => handleChartConfigChange(chart.id, newConfig)}
                  onOpenConfig={() => handleOpenConfig(chart.id)}
                  isFullScreen={false}
                />
              </div>
              <div className="chart-body">
                {chart.component}
              </div>
            </div>
          ))}
        </GridLayout>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
