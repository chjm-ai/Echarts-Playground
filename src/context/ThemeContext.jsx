import React, { createContext, useContext, useState, useEffect } from 'react'
import { defaultTheme, getThemeColors } from '../config/themes'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // 从 localStorage 读取保存的主题，如果没有则使用默认主题
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('echarts-theme')
    return savedTheme || defaultTheme
  })

  // 当主题改变时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('echarts-theme', currentTheme)
  }, [currentTheme])

  const changeTheme = (themeKey) => {
    setCurrentTheme(themeKey)
  }

  const themeColors = getThemeColors(currentTheme)

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

