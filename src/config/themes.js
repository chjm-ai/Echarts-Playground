// 主题配色方案配置
// 仅包含来源明确的官方配色方案：
// 1. ECharts 官方默认配色 - 来源：ECharts 官方文档和主题编辑器
// 2. Ant Design 配色方案 - 来源：Ant Design 官方设计系统文档
// 3. Material Design 配色方案 - 来源：Google Material Design 官方设计规范

export const themes = {
  // ECharts 官方默认配色
  // 来源：https://echarts.apache.org/zh/theme-builder.html
  echarts: {
    name: 'ECharts 官方',
    colors: [
      '#5470c6', // 蓝色
      '#91cc75', // 绿色
      '#fac858', // 黄色
      '#ee6666', // 红色
      '#73c0de', // 浅蓝色
      '#3ba272', // 深绿色
      '#fc8452', // 橙色
      '#9a60b4', // 紫色
      '#ea7ccc', // 粉色
      '#ff9f7f'  // 浅橙色
    ]
  },
  
  // Ant Design 配色方案
  // 来源：https://ant.design/docs/spec/colors-cn
  antd: {
    name: 'Ant Design',
    colors: [
      '#1890ff', // 蓝色
      '#52c41a', // 绿色
      '#faad14', // 金色
      '#f5222d', // 红色
      '#722ed1', // 紫色
      '#13c2c2', // 青色
      '#fa8c16', // 橙色
      '#eb2f96', // 粉色
      '#2f54eb', // 深蓝色
      '#a0d911'  // 浅绿色
    ]
  },
  
  // Material Design 配色方案
  // 来源：https://m3.material.io/styles/color/overview
  material: {
    name: 'Material Design',
    colors: [
      '#2196F3', // 蓝色
      '#4CAF50', // 绿色
      '#FF9800', // 橙色
      '#F44336', // 红色
      '#9C27B0', // 紫色
      '#00BCD4', // 青色
      '#FFEB3B', // 黄色
      '#795548', // 棕色
      '#607D8B', // 蓝灰色
      '#E91E63'  // 粉色
    ]
  }
}

// 默认主题
export const defaultTheme = 'echarts'

// 获取所有主题列表（包括自定义主题）
export const getAllThemes = () => {
  const builtInThemes = Object.keys(themes).map(key => ({
    key,
    name: themes[key].name,
    colors: themes[key].colors,
    isCustom: false
  }))
  
  // 加载自定义主题
  const customThemes = loadCustomThemes()
  
  return [...builtInThemes, ...customThemes]
}

// 加载自定义主题
export const loadCustomThemes = () => {
  try {
    const saved = localStorage.getItem('echarts-custom-themes')
    if (!saved) return []
    
    const customThemes = JSON.parse(saved)
    return Object.keys(customThemes).map(key => ({
      key,
      name: customThemes[key].name,
      colors: customThemes[key].colors,
      isCustom: true
    }))
  } catch (error) {
    console.error('加载自定义主题失败:', error)
    return []
  }
}

// 保存自定义主题
export const saveCustomTheme = (name, colors) => {
  try {
    const saved = localStorage.getItem('echarts-custom-themes')
    const customThemes = saved ? JSON.parse(saved) : {}
    
    // 生成唯一 key
    const key = `custom_${Date.now()}`
    customThemes[key] = {
      name,
      colors
    }
    
    localStorage.setItem('echarts-custom-themes', JSON.stringify(customThemes))
    return key
  } catch (error) {
    console.error('保存自定义主题失败:', error)
    return null
  }
}

// 删除自定义主题
export const deleteCustomTheme = (key) => {
  try {
    const saved = localStorage.getItem('echarts-custom-themes')
    if (!saved) return false
    
    const customThemes = JSON.parse(saved)
    delete customThemes[key]
    
    localStorage.setItem('echarts-custom-themes', JSON.stringify(customThemes))
    return true
  } catch (error) {
    console.error('删除自定义主题失败:', error)
    return false
  }
}

// 获取主题颜色数组（包括自定义主题）
export const getThemeColors = (themeKey = defaultTheme) => {
  // 先检查内置主题
  if (themes[themeKey]) {
    return themes[themeKey].colors
  }
  
  // 检查自定义主题
  if (themeKey.startsWith('custom_')) {
    try {
      const saved = localStorage.getItem('echarts-custom-themes')
      if (saved) {
        const customThemes = JSON.parse(saved)
        if (customThemes[themeKey]) {
          return customThemes[themeKey].colors
        }
      }
    } catch (error) {
      console.error('获取自定义主题失败:', error)
    }
  }
  
  // 默认返回 ECharts 官方配色
  return themes[defaultTheme].colors
}

// 获取主题名称（包括自定义主题）
export const getThemeName = (themeKey = defaultTheme) => {
  // 先检查内置主题
  if (themes[themeKey]) {
    return themes[themeKey].name
  }
  
  // 检查自定义主题
  if (themeKey.startsWith('custom_')) {
    try {
      const saved = localStorage.getItem('echarts-custom-themes')
      if (saved) {
        const customThemes = JSON.parse(saved)
        if (customThemes[themeKey]) {
          return customThemes[themeKey].name
        }
      }
    } catch (error) {
      console.error('获取自定义主题名称失败:', error)
    }
  }
  
  // 默认返回 ECharts 官方名称
  return themes[defaultTheme].name
}

