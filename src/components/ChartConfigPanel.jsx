import React, { useState, useRef, useEffect } from 'react'
import { Settings, X, Save, Copy, Check, ChevronDown } from 'lucide-react'
import './ChartConfigPanel.css'
import './CommonConfigPanel.css' // Reuse common form styles

function ChartConfigPanel({ 
  chartId, 
  chartType, 
  chartTitle,
  config, 
  onConfigChange,
  onSave,
  onCancel,
  onOpenConfig,
  chartComponent,
  isFullScreen = false,
  previewSize = null,
  previewLayoutParams = null
}) {
  const [copied, setCopied] = useState(false)
  const configPanelRef = useRef(null)
  const [dynamicPreviewSize, setDynamicPreviewSize] = useState(previewSize)

  // 响应式计算预览尺寸（如果提供了布局参数）
  useEffect(() => {
    if (!isFullScreen || !previewLayoutParams || !previewLayoutParams.layoutItem) {
      setDynamicPreviewSize(previewSize)
      return
    }

    const calculateSize = (currentGridWidth) => {
      const { layoutItem, cols, rowHeight, marginX, marginY } = previewLayoutParams
      // 使用传入的 gridWidth 或当前窗口宽度计算
      const gridWidth = currentGridWidth || previewLayoutParams.gridWidth
      const colWidth = (gridWidth - marginX * (cols - 1)) / cols
      const width = colWidth * layoutItem.w + marginX * (layoutItem.w - 1)
      const height = rowHeight * layoutItem.h + marginY * (layoutItem.h - 1)
      
      return {
        width: Math.round(width),
        height: Math.round(height)
      }
    }

    // 初始计算
    setDynamicPreviewSize(calculateSize())

    // 监听窗口大小变化，实时计算新的尺寸
    const handleResize = () => {
      // 模拟 dashboard 的计算逻辑，与 Dashboard.jsx 中的 updateWidth 保持一致
      // dashboard-content 有 max-width: 1600px 和 padding: 24px
      // dashboard-grid-wrapper 的 offsetWidth 是 dashboard-content 的内容宽度（已减去 padding）
      // Dashboard 中: width = gridWrapperRef.current.offsetWidth - 48
      const contentMaxWidth = 1600
      const contentPadding = 24  // dashboard-content 的 padding (左右各 24px)
      const viewportWidth = window.innerWidth
      
      // 计算 dashboard-content 的实际宽度
      const contentWidth = Math.min(viewportWidth, contentMaxWidth)
      // dashboard-grid-wrapper 的宽度（内容宽度，已减去左右 padding）
      const gridWrapperWidth = contentWidth - contentPadding * 2
      // Dashboard 中实际使用的 gridWidth（再减去 48，与 Dashboard.jsx 中的逻辑一致）
      const actualGridWidth = Math.max(800, gridWrapperWidth - 48)
      
      // 使用新的 gridWidth 重新计算
      const newSize = calculateSize(actualGridWidth)
      setDynamicPreviewSize(newSize)
    }

    // 初始计算一次（使用传入的 gridWidth）
    setDynamicPreviewSize(calculateSize())
    
    // 监听窗口大小变化
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isFullScreen, previewLayoutParams, previewSize])

  // 使用动态计算的尺寸或传入的固定尺寸
  const finalPreviewSize = previewLayoutParams ? dynamicPreviewSize : previewSize
  const previewStyle = (isFullScreen && finalPreviewSize)
    ? {
        width: `${finalPreviewSize.width}px`,
        height: `${finalPreviewSize.height}px`,
        maxWidth: '100%',
        maxHeight: '100%'
      }
    : {}

  const updateConfig = (key, value) => {
    // 支持嵌套路径，如 'lineStyle.width'
    const keys = key.split('.')
    const newConfig = { ...config }
    let current = newConfig
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      } else {
        current[keys[i]] = { ...current[keys[i]] }
      }
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    onConfigChange(newConfig)
  }

  const getNestedValue = (path) => {
    const keys = path.split('.')
    let value = config
    for (const key of keys) {
      value = value?.[key]
    }
    return value
  }

  const handleCopyConfig = () => {
    const configJson = JSON.stringify(config, null, 2)
    navigator.clipboard.writeText(configJson).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(err => {
      console.error('复制失败:', err)
    })
  }

  // 渲染配置内容（所有图表类型的配置项）
  function renderConfigContent() {
    switch (chartType) {
      case 'lineChart':
        return renderLineChartConfig()
      case 'barChart':
        return renderBarChartConfig()
      case 'pieChart':
        return renderPieChartConfig()
      case 'scatterChart':
        return renderScatterChartConfig()
      case 'radarChart':
        return renderRadarChartConfig()
      case 'stackedBarChart':
        return renderStackedBarChartConfig()
      case 'horizontalBarChart':
        return renderHorizontalBarChartConfig()
      default:
        return null
    }
  }

  const renderSectionHeader = (title) => (
    <div className="section-header">
      <h3>{title}</h3>
    </div>
  )

  // 折线图配置项
  function renderLineChartConfig() {
    return (
      <div className="config-content">
        <div className="config-section">
          {renderSectionHeader('基础配置')}
          <div className="config-grid">
            <div className="form-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={getNestedValue('smooth') || false}
                  onChange={(e) => updateConfig('smooth', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span>平滑曲线 (smooth)</span>
              </label>
            </div>
            
            <div className="form-item">
              <label>阶梯线 (step)</label>
              <div className="select-wrapper">
                <select
                  value={getNestedValue('step') || 'false'}
                  onChange={(e) => updateConfig('step', e.target.value === 'true' ? true : e.target.value === 'start' ? 'start' : e.target.value === 'middle' ? 'middle' : e.target.value === 'end' ? 'end' : false)}
                >
                  <option value="false">关闭 (false)</option>
                  <option value="true">开启 (true)</option>
                  <option value="start">开始 (start)</option>
                  <option value="middle">中间 (middle)</option>
                  <option value="end">结束 (end)</option>
                </select>
              </div>
            </div>
            
            <div className="form-item">
              <label>堆叠名称 (stack)</label>
              <input
                type="text"
                className="text-input"
                value={getNestedValue('stack') || ''}
                onChange={(e) => updateConfig('stack', e.target.value || null)}
                placeholder="留空为不堆叠"
              />
            </div>
          </div>
        </div>

        <div className="config-section">
          {renderSectionHeader('线条样式 (LineStyle)')}
          <div className="config-grid">
            <div className="form-item">
              <label>宽度 (width)</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('lineStyle.width') || getNestedValue('lineWidth') || 2}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 2
                  updateConfig('lineStyle.width', value)
                  updateConfig('lineWidth', value)
                }}
                min="1"
                max="20"
              />
            </div>
            
            <div className="form-item">
              <label>类型 (type)</label>
              <div className="select-wrapper">
                <select
                  value={getNestedValue('lineStyle.type') || getNestedValue('lineStyleType') || 'solid'}
                  onChange={(e) => {
                    const value = e.target.value
                    updateConfig('lineStyle.type', value)
                    updateConfig('lineStyleType', value)
                  }}
                >
                  <option value="solid">实线 (solid)</option>
                  <option value="dashed">虚线 (dashed)</option>
                  <option value="dotted">点线 (dotted)</option>
                </select>
              </div>
            </div>
            
            <div className="form-item">
              <label>透明度 (opacity)</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('lineStyle.opacity') !== undefined ? getNestedValue('lineStyle.opacity') : 1}
                onChange={(e) => updateConfig('lineStyle.opacity', parseFloat(e.target.value) || 1)}
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="config-section">
          {renderSectionHeader('区域填充 (AreaStyle)')}
          <div className="config-grid">
            <div className="form-item full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={(getNestedValue('areaStyle') !== null && getNestedValue('areaStyle') !== undefined) || getNestedValue('showArea') || false}
                  onChange={(e) => {
                    const checked = e.target.checked
                    if (checked) {
                      const opacity = getNestedValue('areaStyle')?.opacity || getNestedValue('areaOpacity')?.[0] || 0.3
                      updateConfig('areaStyle', { opacity })
                      updateConfig('areaOpacity', [opacity, opacity * 0.3])
                      updateConfig('showArea', true)
                    } else {
                      updateConfig('areaStyle', null)
                      updateConfig('showArea', false)
                    }
                  }}
                />
                <span className="checkbox-custom"></span>
                <span>显示区域填充</span>
              </label>
            </div>
            
            {((getNestedValue('areaStyle') !== null && getNestedValue('areaStyle') !== undefined) || getNestedValue('showArea')) && (
              <div className="form-item">
                <label>透明度 (opacity)</label>
                <input
                  type="number"
                  className="text-input"
                  value={getNestedValue('areaStyle')?.opacity || getNestedValue('areaOpacity')?.[0] || 0.3}
                  onChange={(e) => {
                    const opacity = parseFloat(e.target.value) || 0.3
                    updateConfig('areaStyle', { opacity })
                    updateConfig('areaOpacity', [opacity, opacity * 0.3])
                  }}
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>
            )}
          </div>
        </div>

        <div className="config-section">
          {renderSectionHeader('数据点 (Symbol)')}
          <div className="config-grid">
              <div className="form-item full-width">
                <label className="checkbox-label">
                 <input
                   type="checkbox"
                   checked={(() => {
                     const symbol = getNestedValue('symbol')
                     const showSymbol = getNestedValue('showSymbol')
                     if (symbol === 'none') return false
                     if (symbol && symbol !== 'none') return true
                     if (showSymbol === false) return false
                     if (showSymbol === true) return true
                     return false
                   })()}
                   onChange={(e) => {
                     const checked = e.target.checked
                     if (checked) {
                       const currentSymbol = getNestedValue('symbol')
                       const newSymbol = (currentSymbol && currentSymbol !== 'none') ? currentSymbol : 'circle'
                       // 先创建新配置对象，包含所有更新
                       const newConfig = { ...config }
                       newConfig.symbol = newSymbol
                       newConfig.showSymbol = true
                       onConfigChange(newConfig)
                     } else {
                       // 先创建新配置对象，包含所有更新
                       const newConfig = { ...config }
                       newConfig.symbol = 'none'
                       newConfig.showSymbol = false
                       onConfigChange(newConfig)
                     }
                   }}
                 />
                 <span className="checkbox-custom"></span>
                 <span>显示数据点</span>
               </label>
             </div>
            
            {(() => {
              const symbol = getNestedValue('symbol')
              const showSymbol = getNestedValue('showSymbol')
              return (symbol && symbol !== 'none') || (showSymbol === true)
            })() && (
              <>
                <div className="form-item">
                  <label>形状</label>
                  <div className="select-wrapper">
                    <select
                      value={(() => {
                        const symbol = getNestedValue('symbol')
                        return (symbol && symbol !== 'none') ? symbol : 'circle'
                      })()}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value !== 'none') {
                          updateConfig('symbol', value)
                          updateConfig('showSymbol', true)
                        }
                      }}
                    >
                      <option value="circle">圆形 (circle)</option>
                      <option value="rect">矩形 (rect)</option>
                      <option value="roundRect">圆角矩形 (roundRect)</option>
                      <option value="triangle">三角形 (triangle)</option>
                      <option value="diamond">菱形 (diamond)</option>
                      <option value="pin">气泡 (pin)</option>
                      <option value="arrow">箭头 (arrow)</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-item">
                  <label>大小 (size)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={getNestedValue('symbolSize') || 8}
                    onChange={(e) => updateConfig('symbolSize', parseInt(e.target.value) || 8)}
                    min="1"
                    max="50"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="config-section">
          {renderSectionHeader('标签配置 (Label)')}
          <div className="config-grid">
            <div className="form-item full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={getNestedValue('label.show') !== undefined ? getNestedValue('label.show') : (getNestedValue('showLabel') || false)}
                  onChange={(e) => {
                    const checked = e.target.checked
                    // 先创建新配置对象，包含所有更新
                    const newConfig = { ...config }
                    if (!newConfig.label) newConfig.label = {}
                    newConfig.label = { ...newConfig.label }
                    newConfig.label.show = checked
                    newConfig.showLabel = checked
                    if (checked) {
                      // 确保其他label属性存在
                      newConfig.label.position = newConfig.label.position || getNestedValue('labelPosition') || 'top'
                      newConfig.label.formatter = newConfig.label.formatter || getNestedValue('labelFormatter') || '{c}'
                      newConfig.label.fontSize = newConfig.label.fontSize || getNestedValue('labelFontSize') || 12
                      newConfig.label.color = newConfig.label.color || getNestedValue('labelColor') || '#333'
                    }
                    onConfigChange(newConfig)
                  }}
                />
                <span className="checkbox-custom"></span>
                <span>显示标签</span>
              </label>
            </div>
            
            {(getNestedValue('label.show') !== undefined ? getNestedValue('label.show') : (getNestedValue('showLabel') || false)) && (
              <>
                <div className="form-item">
                  <label>位置 (position)</label>
                  <div className="select-wrapper">
                    <select
                      value={getNestedValue('label.position') !== undefined && getNestedValue('label.position') !== null ? getNestedValue('label.position') : (getNestedValue('labelPosition') !== undefined && getNestedValue('labelPosition') !== null ? getNestedValue('labelPosition') : 'top')}
                      onChange={(e) => {
                        const value = e.target.value
                        updateConfig('label.position', value)
                        updateConfig('labelPosition', value)
                      }}
                    >
                      <option value="top">顶部 (top)</option>
                      <option value="left">左侧 (left)</option>
                      <option value="right">右侧 (right)</option>
                      <option value="bottom">底部 (bottom)</option>
                      <option value="inside">内部 (inside)</option>
                      <option value="insideLeft">内左 (insideLeft)</option>
                      <option value="insideRight">内右 (insideRight)</option>
                      <option value="insideTop">内上 (insideTop)</option>
                      <option value="insideBottom">内下 (insideBottom)</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-item">
                  <label>格式化 (formatter)</label>
                  <input
                    type="text"
                    className="text-input"
                    value={getNestedValue('label.formatter') || getNestedValue('labelFormatter') || '{c}'}
                    onChange={(e) => {
                      const value = e.target.value
                      updateConfig('label.formatter', value)
                      updateConfig('labelFormatter', value)
                    }}
                    placeholder="{c} 表示数值"
                  />
                </div>
                
                <div className="form-item">
                  <label>字体大小 (fontSize)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={getNestedValue('label.fontSize') !== undefined && getNestedValue('label.fontSize') !== null ? getNestedValue('label.fontSize') : (getNestedValue('labelFontSize') !== undefined && getNestedValue('labelFontSize') !== null ? getNestedValue('labelFontSize') : 12)}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 12
                      updateConfig('label.fontSize', value)
                      updateConfig('labelFontSize', value)
                    }}
                    min="8"
                    max="24"
                  />
                </div>
                
                <div className="form-item">
                  <label>颜色 (color)</label>
                  <div className="color-input-wrapper">
                    <input
                      type="color"
                      value={getNestedValue('label.color') || getNestedValue('labelColor') || '#333'}
                      onChange={(e) => {
                        const value = e.target.value
                        updateConfig('label.color', value)
                        updateConfig('labelColor', value)
                      }}
                    />
                    <span className="color-value">{getNestedValue('label.color') || getNestedValue('labelColor') || '#333'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 柱状图配置项
  function renderBarChartConfig() {
    return (
      <div className="config-content">
        <div className="config-section">
          {renderSectionHeader('基础配置')}
          <div className="config-grid">
            <div className="form-item">
              <label>柱宽度 (barWidth)</label>
              <input
                type="text"
                className="text-input"
                value={getNestedValue('barWidth') || ''}
                onChange={(e) => updateConfig('barWidth', e.target.value || null)}
                placeholder="留空自适应"
              />
            </div>
            
            <div className="form-item">
              <label>最大宽度</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('barMaxWidth') || 60}
                onChange={(e) => updateConfig('barMaxWidth', parseInt(e.target.value) || 60)}
                min="10"
                max="200"
              />
            </div>
            
            <div className="form-item">
              <label>柱间距离 (barGap)</label>
              <input
                type="text"
                className="text-input"
                value={getNestedValue('barGap') || '20%'}
                onChange={(e) => updateConfig('barGap', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="config-section">
          {renderSectionHeader('样式配置')}
          <div className="config-grid">
            <div className="form-item">
              <label>颜色</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={getNestedValue('itemStyle.color') || '#6085E4'}
                  onChange={(e) => updateConfig('itemStyle.color', e.target.value)}
                />
                <span className="color-value">{getNestedValue('itemStyle.color') || '#6085E4'}</span>
              </div>
            </div>
            
            <div className="form-item">
              <label>圆角 (borderRadius)</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('itemStyle.borderRadius') || getNestedValue('borderRadius') || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  updateConfig('itemStyle.borderRadius', value)
                  updateConfig('borderRadius', value)
                }}
                min="0"
                max="20"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 饼图配置项
  function renderPieChartConfig() {
    return (
      <div className="config-content">
        <div className="config-section">
          {renderSectionHeader('基础配置')}
          <div className="config-grid">
            <div className="form-item">
              <label>半径 (radius)</label>
              <input
                type="text"
                className="text-input"
                value={Array.isArray(getNestedValue('radius')) ? getNestedValue('radius').join(',') : getNestedValue('radius') || '40%,65%'}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.includes(',')) {
                    updateConfig('radius', value.split(',').map(v => v.trim()))
                  } else {
                    updateConfig('radius', value)
                  }
                }}
                placeholder="如: 40%,65%"
              />
            </div>
            
            <div className="form-item">
              <label>中心位置 (center)</label>
              <input
                type="text"
                className="text-input"
                value={Array.isArray(getNestedValue('center')) ? getNestedValue('center').join(',') : getNestedValue('center') || '50%,50%'}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.includes(',')) {
                    updateConfig('center', value.split(',').map(v => v.trim()))
                  } else {
                    updateConfig('center', value)
                  }
                }}
                placeholder="如: 50%,50%"
              />
            </div>
            
            <div className="form-item">
              <label>玫瑰图类型</label>
              <div className="select-wrapper">
                <select
                  value={getNestedValue('roseType') || 'none'}
                  onChange={(e) => updateConfig('roseType', e.target.value === 'none' ? null : e.target.value)}
                >
                  <option value="none">无 (none)</option>
                  <option value="radius">半径模式 (radius)</option>
                  <option value="area">面积模式 (area)</option>
                </select>
              </div>
            </div>
            
             <div className="form-item">
              <label>圆角 (borderRadius)</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('itemStyle.borderRadius') || getNestedValue('borderRadius') || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  updateConfig('itemStyle.borderRadius', value)
                  updateConfig('borderRadius', value)
                }}
                min="0"
                max="20"
              />
            </div>
          </div>
        </div>

        <div className="config-section">
          {renderSectionHeader('标签配置')}
           <div className="config-grid">
             <div className="form-item full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={getNestedValue('showLabel') !== false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateConfig('label', {
                        show: true,
                        position: getNestedValue('labelPosition') || 'outside',
                        formatter: getNestedValue('labelFormatter') || '{b}\n{d}%',
                        fontSize: getNestedValue('labelFontSize') || 12,
                        color: getNestedValue('labelColor') || '#333'
                      })
                    } else {
                      updateConfig('label', { show: false })
                    }
                    updateConfig('showLabel', e.target.checked)
                  }}
                />
                <span className="checkbox-custom"></span>
                <span>显示标签</span>
              </label>
            </div>
            
            {getNestedValue('showLabel') !== false && (
              <>
                <div className="form-item">
                  <label>位置</label>
                  <div className="select-wrapper">
                    <select
                      value={getNestedValue('label.position') || getNestedValue('labelPosition') || 'outside'}
                      onChange={(e) => {
                        updateConfig('label.position', e.target.value)
                        updateConfig('labelPosition', e.target.value)
                      }}
                    >
                      <option value="outside">外部 (outside)</option>
                      <option value="inside">内部 (inside)</option>
                      <option value="center">中心 (center)</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-item">
                  <label>格式化</label>
                  <input
                    type="text"
                    className="text-input"
                    value={getNestedValue('label.formatter') || getNestedValue('labelFormatter') || '{b}\n{d}%'}
                    onChange={(e) => {
                      updateConfig('label.formatter', e.target.value)
                      updateConfig('labelFormatter', e.target.value)
                    }}
                  />
                </div>
              </>
            )}
           </div>
        </div>
      </div>
    )
  }

  // 散点图配置项
  function renderScatterChartConfig() {
    return (
      <div className="config-content">
        <div className="config-section">
          {renderSectionHeader('数据点配置')}
          <div className="config-grid">
            <div className="form-item">
              <label>形状</label>
              <div className="select-wrapper">
                <select
                  value={getNestedValue('symbol') || 'circle'}
                  onChange={(e) => updateConfig('symbol', e.target.value)}
                >
                  <option value="circle">圆形 (circle)</option>
                  <option value="rect">矩形 (rect)</option>
                  <option value="triangle">三角形 (triangle)</option>
                  <option value="diamond">菱形 (diamond)</option>
                </select>
              </div>
            </div>
            
            <div className="form-item">
              <label>大小</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('symbolSize') || 10}
                onChange={(e) => updateConfig('symbolSize', parseInt(e.target.value) || 10)}
                min="1"
                max="100"
              />
            </div>
            
            <div className="form-item">
              <label>透明度</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('itemStyle.opacity') || getNestedValue('opacity') || 0.7}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0.7
                  updateConfig('itemStyle.opacity', value)
                  updateConfig('opacity', value)
                }}
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 雷达图配置项
  function renderRadarChartConfig() {
    return (
      <div className="config-content">
        <div className="config-section">
          {renderSectionHeader('基础配置')}
           <div className="config-grid">
            <div className="form-item">
              <label>中心位置</label>
              <input
                type="text"
                className="text-input"
                value={Array.isArray(getNestedValue('center')) ? getNestedValue('center').join(',') : getNestedValue('center') || '50%,50%'}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.includes(',')) {
                    updateConfig('center', value.split(',').map(v => v.trim()))
                  } else {
                    updateConfig('center', value)
                  }
                }}
                placeholder="如: 50%,50%"
              />
            </div>
            
            <div className="form-item">
              <label>半径</label>
              <input
                type="text"
                className="text-input"
                value={getNestedValue('radius') || '65%'}
                onChange={(e) => updateConfig('radius', e.target.value)}
              />
            </div>
            
            <div className="form-item">
              <label>形状</label>
              <div className="select-wrapper">
                <select
                  value={getNestedValue('shape') || 'polygon'}
                  onChange={(e) => updateConfig('shape', e.target.value)}
                >
                  <option value="polygon">多边形 (polygon)</option>
                  <option value="circle">圆形 (circle)</option>
                </select>
              </div>
            </div>
            
            <div className="form-item">
              <label>区域透明度</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('areaOpacity') || 0.2}
                onChange={(e) => updateConfig('areaOpacity', parseFloat(e.target.value) || 0.2)}
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 堆叠柱状图配置项
  function renderStackedBarChartConfig() {
    return (
      <div className="config-content">
        <div className="config-section">
          {renderSectionHeader('圆角配置')}
          <div className="config-grid">
             <div className="form-item full-width">
              <label>第一项圆角 (Top)</label>
              <input
                type="text"
                className="text-input"
                value={Array.isArray(getNestedValue('borderRadius.first')) ? getNestedValue('borderRadius.first').join(',') : getNestedValue('borderRadius.first') || '0,0,8,8'}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.includes(',')) {
                    updateConfig('borderRadius.first', value.split(',').map(v => parseInt(v.trim()) || 0))
                  } else {
                    updateConfig('borderRadius.first', parseInt(value) || 0)
                  }
                }}
                placeholder="如: 0,0,8,8"
              />
            </div>
             <div className="form-item full-width">
              <label>最后一项圆角 (Bottom)</label>
              <input
                type="text"
                className="text-input"
                value={Array.isArray(getNestedValue('borderRadius.last')) ? getNestedValue('borderRadius.last').join(',') : getNestedValue('borderRadius.last') || '8,8,0,0'}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.includes(',')) {
                    updateConfig('borderRadius.last', value.split(',').map(v => parseInt(v.trim()) || 0))
                  } else {
                    updateConfig('borderRadius.last', parseInt(value) || 0)
                  }
                }}
                placeholder="如: 8,8,0,0"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 横向条形图配置项
  function renderHorizontalBarChartConfig() {
    return (
      <div className="config-content">
        <div className="config-section">
          {renderSectionHeader('基础配置')}
          <div className="config-grid">
             <div className="form-item">
              <label>柱宽度</label>
              <input
                type="text"
                className="text-input"
                value={getNestedValue('barWidth') || ''}
                onChange={(e) => updateConfig('barWidth', e.target.value || null)}
                placeholder="留空自适应"
              />
            </div>
             <div className="form-item">
              <label>圆角</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('itemStyle.borderRadius') || getNestedValue('borderRadius') || 0}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  updateConfig('itemStyle.borderRadius', value)
                  updateConfig('borderRadius', value)
                }}
                min="0"
                max="20"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 如果是全屏模式，渲染全屏布局
  if (isFullScreen) {
    return (
      <div className="chart-config-fullscreen">
        <div className="config-fullscreen-header">
          <div className="header-title">
            <h2>{chartTitle || '图表配置'}</h2>
            <span className="header-subtitle">{chartType}</span>
          </div>
          <div className="config-fullscreen-actions">
            <button
              className={`action-button ${copied ? 'success' : ''}`}
              onClick={handleCopyConfig}
              title="复制配置JSON"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <div className="divider"></div>
            <button className="text-button cancel" onClick={onCancel}>
              取消
            </button>
            <button className="primary-button" onClick={onSave}>
              <Save size={16} style={{ marginRight: 6 }} />
              保存更改
            </button>
          </div>
        </div>
        <div className="config-fullscreen-body">
          <div className="config-fullscreen-chart">
            <div className="chart-preview-card" style={previewStyle}>
              <div className="chart-preview-header">
                <h3>预览</h3>
              </div>
              <div className="chart-preview-container">
                {chartComponent}
              </div>
            </div>
          </div>
          <div className="config-fullscreen-sidebar custom-scrollbar" ref={configPanelRef}>
            <div className="config-sidebar-content">
              {renderConfigContent()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 普通模式：只显示配置按钮
  return (
    <button
      className="chart-config-button"
      onClick={onOpenConfig}
      title="配置图表"
    >
      <Settings size={16} />
    </button>
  )
}

export default ChartConfigPanel
