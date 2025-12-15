import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { saveCustomTheme } from '../config/themes'
import './CustomThemeDialog.css'

function CustomThemeDialog({ isOpen, onClose, onSave }) {
  const [themeName, setThemeName] = useState('')
  const [colorInput, setColorInput] = useState('')
  const [colors, setColors] = useState([])
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // 验证颜色格式
  const validateColor = (color) => {
    // 支持 #RRGGBB, #RGB, rgb(r,g,b), rgba(r,g,b,a) 格式
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/
    
    const trimmed = color.trim()
    return hexPattern.test(trimmed) || rgbPattern.test(trimmed)
  }

  // 处理颜色输入变化
  const handleColorInputChange = (value) => {
    setColorInput(value)
    setError('')
    
    if (!value.trim()) {
      setColors([])
      return
    }
    
    // 按逗号分割
    const colorArray = value.split(',').map(c => c.trim()).filter(c => c)
    
    // 验证每个颜色
    const validColors = []
    const invalidColors = []
    
    colorArray.forEach((color, index) => {
      if (validateColor(color)) {
        validColors.push(color)
      } else {
        invalidColors.push({ index, color })
      }
    })
    
    setColors(validColors)
    
    if (invalidColors.length > 0) {
      setError(`以下颜色格式不正确: ${invalidColors.map(i => i.color).join(', ')}`)
    }
  }

  // 处理保存
  const handleSave = () => {
    if (!themeName.trim()) {
      setError('请输入主题名称')
      return
    }
    
    if (colors.length === 0) {
      setError('请输入至少一个有效的颜色值')
      return
    }
    
    const themeKey = saveCustomTheme(themeName.trim(), colors)
    if (themeKey) {
      // 重置表单
      setThemeName('')
      setColorInput('')
      setColors([])
      setError('')
      onSave(themeKey)
      onClose()
    } else {
      setError('保存失败，请重试')
    }
  }

  // 处理取消
  const handleCancel = () => {
    setThemeName('')
    setColorInput('')
    setColors([])
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="custom-theme-dialog-overlay" onClick={handleCancel}>
      <div className="custom-theme-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="custom-theme-dialog-header">
          <h3>添加自定义主题</h3>
          <button className="custom-theme-dialog-close" onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>
        
        <div className="custom-theme-dialog-body">
          <div className="custom-theme-form-group">
            <label>主题名称</label>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="例如：我的主题"
              className="custom-theme-input"
            />
          </div>
          
          <div className="custom-theme-form-group">
            <label>颜色值（用逗号分隔）</label>
            <input
              ref={inputRef}
              type="text"
              value={colorInput}
              onChange={(e) => handleColorInputChange(e.target.value)}
              placeholder="例如：#5470c6, #91cc75, #fac858, #ee6666"
              className="custom-theme-input"
            />
            <div className="custom-theme-hint">
              支持格式：#RRGGBB, #RGB, rgb(r,g,b), rgba(r,g,b,a)
            </div>
          </div>
          
          {colors.length > 0 && (
            <div className="custom-theme-preview">
              <label>颜色预览</label>
              <div className="custom-theme-colors">
                {colors.map((color, index) => (
                  <div key={index} className="custom-theme-color-item">
                    <div
                      className="custom-theme-color-dot"
                      style={{ backgroundColor: color }}
                    />
                    <span className="custom-theme-color-value">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {error && (
            <div className="custom-theme-error">{error}</div>
          )}
        </div>
        
        <div className="custom-theme-dialog-footer">
          <button className="custom-theme-button cancel" onClick={handleCancel}>
            取消
          </button>
          <button className="custom-theme-button save" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomThemeDialog


