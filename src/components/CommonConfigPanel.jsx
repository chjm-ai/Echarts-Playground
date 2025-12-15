import React from 'react'
import { ChevronDown, ChevronRight, Hash, Type, Eye, EyeOff } from 'lucide-react'
import './CommonConfigPanel.css'

function CommonConfigPanel({ config, onConfigChange }) {
  // 将 rgba 颜色转换为 hex（用于显示和输入）
  const rgbaToHex = (rgba) => {
    if (!rgba) return '#32325d'
    // 如果已经是 hex 格式，直接返回
    if (rgba.startsWith('#')) {
      return rgba.length === 7 ? rgba : '#32325d'
    }
    // 如果是 rgba 格式，转换为 hex
    if (rgba.startsWith('rgba') || rgba.startsWith('rgb')) {
      const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0')
        const g = parseInt(match[2]).toString(16).padStart(2, '0')
        const b = parseInt(match[3]).toString(16).padStart(2, '0')
        return `#${r}${g}${b}`
      }
    }
    return '#32325d'
  }

  // 将 hex 颜色转换为 rgba
  const hexToRgba = (hex, alpha = 1) => {
    if (!hex || !hex.startsWith('#')) {
      return `rgba(50, 50, 93, ${alpha})`
    }
    // 确保 hex 格式正确
    const cleanHex = hex.length === 7 ? hex : '#32325d'
    const r = parseInt(cleanHex.slice(1, 3), 16)
    const g = parseInt(cleanHex.slice(3, 5), 16)
    const b = parseInt(cleanHex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // 验证十六进制颜色值
  const isValidHex = (hex) => {
    return /^#[0-9A-Fa-f]{6}$/.test(hex)
  }

  const updateConfig = (path, value) => {
    const keys = path.split('.')
    const newConfig = { ...config }
    let current = newConfig
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }
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

  const renderSectionHeader = (title, icon) => (
    <div className="section-header">
      {icon && <span className="section-icon">{icon}</span>}
      <h3>{title}</h3>
    </div>
  )

  return (
    <div className="common-config-panel">
      {/* Tooltip 配置 */}
      <section className="config-section">
        {renderSectionHeader('Tooltip 提示框', <Hash size={16} />)}
        <div className="config-grid">
          <div className="form-item">
            <label>触发方式</label>
            <div className="select-wrapper">
              <select
                value={getNestedValue('tooltip.trigger') || 'axis'}
                onChange={(e) => updateConfig('tooltip.trigger', e.target.value)}
              >
                <option value="axis">坐标轴 (axis)</option>
                <option value="item">数据项 (item)</option>
                <option value="none">不触发 (none)</option>
              </select>
            </div>
          </div>
          
          <div className="form-item">
            <label>指示器类型</label>
            <div className="select-wrapper">
              <select
                value={getNestedValue('tooltip.axisPointer.type') || 'line'}
                onChange={(e) => updateConfig('tooltip.axisPointer.type', e.target.value)}
              >
                <option value="line">直线 (line)</option>
                <option value="shadow">阴影 (shadow)</option>
                <option value="none">无 (none)</option>
                <option value="cross">十字准星 (cross)</option>
              </select>
            </div>
          </div>

          <div className="form-item">
            <label>背景色</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={rgbaToHex(getNestedValue('tooltip.backgroundColor') || 'rgba(50, 50, 93, 0.88)')}
                onChange={(e) => {
                  const hex = e.target.value
                  const rgba = hexToRgba(hex, 0.88)
                  updateConfig('tooltip.backgroundColor', rgba)
                }}
              />
              <input
                type="text"
                className="color-value"
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  padding: 0, 
                  flex: 1,
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: 'var(--text-secondary)',
                  outline: 'none',
                  width: '100%',
                  minWidth: 0
                }}
                value={rgbaToHex(getNestedValue('tooltip.backgroundColor') || 'rgba(50, 50, 93, 0.88)')}
                onChange={(e) => {
                  let hex = e.target.value.trim()
                  // 如果用户输入时没有 #，自动添加
                  if (hex && !hex.startsWith('#')) {
                    hex = '#' + hex
                    e.target.value = hex
                  }
                  // 如果输入的是有效的十六进制颜色，转换为 rgba
                  if (isValidHex(hex)) {
                    const rgba = hexToRgba(hex, 0.88)
                    updateConfig('tooltip.backgroundColor', rgba)
                  }
                }}
                onBlur={(e) => {
                  let hex = e.target.value.trim()
                  // 如果用户输入时没有 #，自动添加
                  if (hex && !hex.startsWith('#')) {
                    hex = '#' + hex
                  }
                  // 如果输入无效，恢复为当前值
                  if (!isValidHex(hex)) {
                    e.target.value = rgbaToHex(getNestedValue('tooltip.backgroundColor') || 'rgba(50, 50, 93, 0.88)')
                  } else {
                    const rgba = hexToRgba(hex, 0.88)
                    updateConfig('tooltip.backgroundColor', rgba)
                  }
                }}
              />
            </div>
          </div>

          <div className="form-item">
            <label>边框颜色</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={rgbaToHex(getNestedValue('tooltip.borderColor') || 'rgba(255, 255, 255, 0.2)')}
                onChange={(e) => {
                  const hex = e.target.value
                  const rgba = hexToRgba(hex, 0.2)
                  updateConfig('tooltip.borderColor', rgba)
                }}
              />
              <input
                type="text"
                className="color-value"
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  padding: 0, 
                  flex: 1,
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: 'var(--text-secondary)',
                  outline: 'none',
                  width: '100%',
                  minWidth: 0
                }}
                value={rgbaToHex(getNestedValue('tooltip.borderColor') || 'rgba(255, 255, 255, 0.2)')}
                onChange={(e) => {
                  let hex = e.target.value.trim()
                  // 如果用户输入时没有 #，自动添加
                  if (hex && !hex.startsWith('#')) {
                    hex = '#' + hex
                    e.target.value = hex
                  }
                  // 如果输入的是有效的十六进制颜色，转换为 rgba
                  if (isValidHex(hex)) {
                    const rgba = hexToRgba(hex, 0.2)
                    updateConfig('tooltip.borderColor', rgba)
                  }
                }}
                onBlur={(e) => {
                  let hex = e.target.value.trim()
                  // 如果用户输入时没有 #，自动添加
                  if (hex && !hex.startsWith('#')) {
                    hex = '#' + hex
                  }
                  // 如果输入无效，恢复为当前值
                  if (!isValidHex(hex)) {
                    e.target.value = rgbaToHex(getNestedValue('tooltip.borderColor') || 'rgba(255, 255, 255, 0.2)')
                  } else {
                    const rgba = hexToRgba(hex, 0.2)
                    updateConfig('tooltip.borderColor', rgba)
                  }
                }}
              />
            </div>
          </div>

          <div className="form-item">
            <label>文字颜色</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={getNestedValue('tooltip.textStyle.color') || '#fff'}
                onChange={(e) => updateConfig('tooltip.textStyle.color', e.target.value)}
              />
              <span className="color-value">{getNestedValue('tooltip.textStyle.color') || '#fff'}</span>
            </div>
          </div>

          <div className="form-item">
            <label>字体大小</label>
            <input
              type="number"
              className="text-input"
              value={getNestedValue('tooltip.textStyle.fontSize') || 12}
              onChange={(e) => updateConfig('tooltip.textStyle.fontSize', parseInt(e.target.value) || 12)}
              min="8"
              max="24"
            />
          </div>
        </div>
      </section>

      {/* Legend 配置 */}
      <section className="config-section">
        {renderSectionHeader('Legend 图例', <Type size={16} />)}
        <div className="config-grid">
          <div className="form-item full-width">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={getNestedValue('legend.show') !== false}
                onChange={(e) => updateConfig('legend.show', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              <span>显示图例</span>
            </label>
          </div>

          <div className="form-item">
            <label>水平位置</label>
            <div className="select-wrapper">
              <select
                value={getNestedValue('legend.left') || 'center'}
                onChange={(e) => {
                  updateConfig('legend.left', e.target.value)
                  // 清除 position 字段，使用 left/top
                  if (getNestedValue('legend.position')) {
                    updateConfig('legend.position', undefined)
                  }
                }}
              >
                <option value="left">左侧 (left)</option>
                <option value="center">居中 (center)</option>
                <option value="right">右侧 (right)</option>
                <option value="10%">10%</option>
                <option value="20%">20%</option>
                <option value="80%">80%</option>
                <option value="90%">90%</option>
              </select>
            </div>
          </div>

          <div className="form-item">
            <label>垂直位置</label>
            <div className="select-wrapper">
              <select
                value={getNestedValue('legend.top') || 'top'}
                onChange={(e) => {
                  updateConfig('legend.top', e.target.value)
                  // 清除 position 字段，使用 left/top
                  if (getNestedValue('legend.position')) {
                    updateConfig('legend.position', undefined)
                  }
                }}
              >
                <option value="top">顶部 (top)</option>
                <option value="middle">中间 (middle)</option>
                <option value="bottom">底部 (bottom)</option>
                <option value="10%">10%</option>
                <option value="20%">20%</option>
                <option value="80%">80%</option>
                <option value="90%">90%</option>
              </select>
            </div>
          </div>

          <div className="form-item">
            <label>排列方向</label>
            <div className="select-wrapper">
              <select
                value={getNestedValue('legend.orient') || 'horizontal'}
                onChange={(e) => updateConfig('legend.orient', e.target.value)}
              >
                <option value="horizontal">水平 (horizontal)</option>
                <option value="vertical">垂直 (vertical)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Grid 配置 */}
      <section className="config-section">
        {renderSectionHeader('Grid 网格', <Hash size={16} />)}
        <div className="config-grid">
           <div className="form-item full-width">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={getNestedValue('grid.show') === true}
                onChange={(e) => updateConfig('grid.show', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              <span>显示网格背景</span>
            </label>
          </div>
          
          <div className="form-item">
            <label>上边距</label>
            <input
              type="text"
              className="text-input"
              value={getNestedValue('grid.top') || '1%'}
              onChange={(e) => updateConfig('grid.top', e.target.value)}
            />
          </div>
          <div className="form-item">
            <label>下边距</label>
            <input
              type="text"
              className="text-input"
              value={getNestedValue('grid.bottom') || '15%'}
              onChange={(e) => updateConfig('grid.bottom', e.target.value)}
            />
          </div>
          <div className="form-item">
            <label>左边距</label>
            <input
              type="text"
              className="text-input"
              value={getNestedValue('grid.left') || '1%'}
              onChange={(e) => updateConfig('grid.left', e.target.value)}
            />
          </div>
          <div className="form-item">
            <label>右边距</label>
            <input
              type="text"
              className="text-input"
              value={getNestedValue('grid.right') || '3%'}
              onChange={(e) => updateConfig('grid.right', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 坐标轴配置 */}
      <section className="config-section">
        {renderSectionHeader('Axis 坐标轴', <Hash size={16} />)}
        
        <div className="subsection">
          <h4>标签 (Label)</h4>
          <div className="config-grid">
            <div className="form-item full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={getNestedValue('axis.label.show') !== false}
                  onChange={(e) => updateConfig('axis.label.show', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span>显示标签</span>
              </label>
            </div>
            
            <div className="form-item">
              <label>字体大小</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('axis.label.fontSize') || 12}
                onChange={(e) => updateConfig('axis.label.fontSize', parseInt(e.target.value))}
                min="8"
                max="24"
              />
            </div>
            
            <div className="form-item">
              <label>旋转角度</label>
              <input
                type="number"
                className="text-input"
                value={getNestedValue('axis.label.rotate') || 0}
                onChange={(e) => updateConfig('axis.label.rotate', parseInt(e.target.value))}
                min="-90"
                max="90"
              />
            </div>
            
            <div className="form-item">
              <label>颜色</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={getNestedValue('axis.label.color') || '#666'}
                  onChange={(e) => updateConfig('axis.label.color', e.target.value)}
                />
                <span className="color-value">{getNestedValue('axis.label.color') || '#666'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="subsection">
          <h4>轴线 (Line)</h4>
          <div className="config-grid">
            <div className="form-item full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={getNestedValue('axis.line.show') !== false}
                  onChange={(e) => updateConfig('axis.line.show', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span>显示轴线</span>
              </label>
            </div>
             <div className="form-item">
              <label>颜色</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={getNestedValue('axis.line.color') || '#e0e0e0'}
                  onChange={(e) => updateConfig('axis.line.color', e.target.value)}
                />
                 <span className="color-value">{getNestedValue('axis.line.color') || '#e0e0e0'}</span>
              </div>
            </div>
             <div className="form-item">
              <label>类型</label>
              <div className="select-wrapper">
                <select
                  value={getNestedValue('axis.line.type') || 'solid'}
                  onChange={(e) => updateConfig('axis.line.type', e.target.value)}
                >
                  <option value="solid">实线 (solid)</option>
                  <option value="dashed">虚线 (dashed)</option>
                  <option value="dotted">点线 (dotted)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="subsection">
          <h4>网格线 (SplitLine)</h4>
          <div className="config-grid">
             <div className="form-item full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={getNestedValue('axis.splitLine.show') !== false}
                  onChange={(e) => updateConfig('axis.splitLine.show', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span>显示网格线</span>
              </label>
            </div>
            
             <div className="form-item">
              <label>颜色</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={getNestedValue('axis.splitLine.color') || '#f0f0f0'}
                  onChange={(e) => updateConfig('axis.splitLine.color', e.target.value)}
                />
                 <span className="color-value">{getNestedValue('axis.splitLine.color') || '#f0f0f0'}</span>
              </div>
            </div>
            
             <div className="form-item">
              <label>类型</label>
              <div className="select-wrapper">
                <select
                  value={getNestedValue('axis.splitLine.type') || 'dashed'}
                  onChange={(e) => updateConfig('axis.splitLine.type', e.target.value)}
                >
                  <option value="solid">实线 (solid)</option>
                  <option value="dashed">虚线 (dashed)</option>
                  <option value="dotted">点线 (dotted)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 标题配置 */}
      <section className="config-section">
        {renderSectionHeader('Title 标题', <Type size={16} />)}
        <div className="config-grid">
          <div className="form-item full-width">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={getNestedValue('title.show') === true}
                onChange={(e) => updateConfig('title.show', e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              <span>显示标题</span>
            </label>
          </div>
          
          <div className="form-item full-width">
            <label>主标题</label>
            <input
              type="text"
              className="text-input"
              value={getNestedValue('title.text') || ''}
              onChange={(e) => updateConfig('title.text', e.target.value)}
              placeholder="输入主标题"
            />
          </div>
          
          <div className="form-item full-width">
            <label>副标题</label>
            <input
              type="text"
              className="text-input"
              value={getNestedValue('title.subtext') || ''}
              onChange={(e) => updateConfig('title.subtext', e.target.value)}
              placeholder="输入副标题"
            />
          </div>
          
          <div className="form-item">
            <label>水平位置</label>
            <div className="select-wrapper">
              <select
                value={getNestedValue('title.left') || 'center'}
                onChange={(e) => updateConfig('title.left', e.target.value)}
              >
                <option value="left">左对齐 (left)</option>
                <option value="center">居中 (center)</option>
                <option value="right">右对齐 (right)</option>
              </select>
            </div>
          </div>
          
          <div className="form-item">
            <label>垂直位置</label>
            <div className="select-wrapper">
              <select
                value={getNestedValue('title.top') || 'top'}
                onChange={(e) => updateConfig('title.top', e.target.value)}
              >
                <option value="top">顶部 (top)</option>
                <option value="middle">中间 (middle)</option>
                <option value="bottom">底部 (bottom)</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CommonConfigPanel
