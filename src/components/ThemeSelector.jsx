import React, { useState, useRef, useEffect } from 'react'
import { Palette, Plus } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { getAllThemes, getThemeName } from '../config/themes'
import CustomThemeDialog from './CustomThemeDialog'
import './ThemeSelector.css'

function ThemeSelector() {
  const { currentTheme, changeTheme, themeColors } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const dropdownRef = useRef(null)

  const allThemes = getAllThemes()

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleThemeChange = (themeKey) => {
    changeTheme(themeKey)
    setIsOpen(false)
  }

  const handleCustomThemeSave = (themeKey) => {
    // 保存后自动切换到新主题
    changeTheme(themeKey)
    setIsOpen(false)
  }

  return (
    <div className="theme-selector" ref={dropdownRef}>
      <button
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        title="切换主题配色"
      >
        <Palette size={18} />
        <span className="theme-selector-label">主题配色</span>
        <span className="theme-selector-current">{getThemeName(currentTheme)}</span>
        <svg
          className={`theme-selector-arrow ${isOpen ? 'open' : ''}`}
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
      </button>

      {isOpen && (
        <div className="theme-selector-dropdown">
          <div className="theme-selector-list">
            {allThemes.map((theme) => (
              <div
                key={theme.key}
                className={`theme-selector-item ${currentTheme === theme.key ? 'active' : ''}`}
                onClick={() => handleThemeChange(theme.key)}
              >
                <div className="theme-selector-item-info">
                  <div className="theme-selector-item-name">
                    {theme.name}
                    {theme.isCustom && (
                      <span className="theme-custom-badge">自定义</span>
                    )}
                  </div>
                  <div className="theme-selector-item-colors">
                    {theme.colors.slice(0, 8).map((color, index) => (
                      <span
                        key={index}
                        className="theme-color-dot"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                    {theme.colors.length > 8 && (
                      <span className="theme-color-more">+{theme.colors.length - 8}</span>
                    )}
                  </div>
                </div>
                {currentTheme === theme.key && (
                  <svg
                    className="theme-selector-check"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3333 4L6 11.3333L2.66667 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div className="theme-selector-footer">
            <button
              className="theme-selector-add-button"
              onClick={() => {
                setIsDialogOpen(true)
                setIsOpen(false)
              }}
            >
              <Plus size={16} />
              <span>添加自定义主题</span>
            </button>
          </div>
        </div>
      )}

      <CustomThemeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleCustomThemeSave}
      />
    </div>
  )
}

export default ThemeSelector

