// 图表颜色配置
// 统一管理所有图表的颜色，方便后续切换

import { defaultTheme, getThemeColors } from './themes'

// 默认颜色（向后兼容）
export const chartColors = getThemeColors(defaultTheme)

// 获取颜色（支持循环使用）
// 如果传入了 themeColors，则使用传入的颜色数组，否则使用默认主题颜色
export const getColor = (index, themeColors = null) => {
  const colors = themeColors || chartColors
  return colors[index % colors.length]
}

// 将颜色转换为 rgba 格式
export const colorToRgba = (color, alpha = 1) => {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

