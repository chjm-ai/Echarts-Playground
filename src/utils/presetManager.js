// 方案管理工具
// 用于保存和加载完整的配置方案（包括主题、通用配置、图表配置等）

import { defaultTheme } from '../config/themes'
import { defaultCommonConfig, defaultChartConfigs } from '../config/chartDefaults'

const PRESET_STORAGE_KEY = 'echarts-presets'
const CURRENT_PRESET_ID_KEY = 'echarts-current-preset-id'
const DEFAULT_PRESET_ID = 'echarts-default'

// 默认布局配置
const defaultLayout = [
  { i: 'line', x: 0, y: 0, w: 6, h: 3, minW: 4, minH: 2 },
  { i: 'bar', x: 6, y: 0, w: 6, h: 3, minW: 4, minH: 2 },
  { i: 'pie', x: 0, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
  { i: 'scatter', x: 4, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
  { i: 'radar', x: 8, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
  { i: 'stacked', x: 0, y: 6, w: 6, h: 3, minW: 4, minH: 2 },
  { i: 'horizontal', x: 6, y: 6, w: 6, h: 3, minW: 4, minH: 2 }
]

// 获取默认方案
export const getDefaultPreset = () => {
  return {
    id: DEFAULT_PRESET_ID,
    name: 'ECharts 默认方案',
    theme: defaultTheme,
    commonConfig: defaultCommonConfig,
    chartConfigs: {
      line: defaultChartConfigs.lineChart,
      bar: defaultChartConfigs.barChart,
      pie: defaultChartConfigs.pieChart,
      scatter: defaultChartConfigs.scatterChart,
      radar: defaultChartConfigs.radarChart,
      stacked: defaultChartConfigs.stackedBarChart,
      horizontal: defaultChartConfigs.horizontalBarChart
    },
    layout: defaultLayout,
    isDefault: true,
    createdAt: new Date(0).toISOString(), // 使用最早的时间，确保排在第一位
    updatedAt: new Date(0).toISOString()
  }
}

// 检查是否是默认方案
export const isDefaultPreset = (id) => {
  return id === DEFAULT_PRESET_ID
}

// 检查方案名称是否重复
export const isPresetNameDuplicate = (name, excludeId = null) => {
  const allPresets = getAllPresets()
  return allPresets.some(preset => 
    preset.name === name && preset.id !== excludeId
  )
}

// 获取所有保存的方案
export const getAllPresets = () => {
  const defaultPreset = getDefaultPreset()
  
  try {
    const saved = localStorage.getItem(PRESET_STORAGE_KEY)
    if (!saved) return [defaultPreset]
    
    const presets = JSON.parse(saved)
    // 转换为数组格式，按创建时间排序
    const customPresets = Object.keys(presets)
      .map(key => ({
        id: key,
        ...presets[key],
        isDefault: false
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    // 默认方案放在最前面
    return [defaultPreset, ...customPresets]
  } catch (error) {
    console.error('加载方案列表失败:', error)
    return [defaultPreset]
  }
}

// 保存方案
export const savePreset = (name, data) => {
  try {
    // 检查名称是否重复
    if (isPresetNameDuplicate(name)) {
      throw new Error('方案名称已存在，请使用其他名称')
    }
    
    const saved = localStorage.getItem(PRESET_STORAGE_KEY)
    const presets = saved ? JSON.parse(saved) : {}
    
    // 生成唯一 ID
    const id = `preset_${Date.now()}`
    
    presets[id] = {
      name,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets))
    return id
  } catch (error) {
    console.error('保存方案失败:', error)
    throw error
  }
}

// 更新方案
export const updatePreset = (id, name, data) => {
  try {
    // 不允许更新默认方案
    if (isDefaultPreset(id)) {
      throw new Error('默认方案不可编辑')
    }
    
    // 检查名称是否重复（排除当前方案）
    if (isPresetNameDuplicate(name, id)) {
      throw new Error('方案名称已存在，请使用其他名称')
    }
    
    const saved = localStorage.getItem(PRESET_STORAGE_KEY)
    if (!saved) return false
    
    const presets = JSON.parse(saved)
    if (!presets[id]) return false
    
    presets[id] = {
      ...presets[id],
      name,
      ...data,
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets))
    return true
  } catch (error) {
    console.error('更新方案失败:', error)
    throw error
  }
}

// 加载方案
export const loadPreset = (id) => {
  try {
    // 如果是默认方案，返回默认配置
    if (isDefaultPreset(id)) {
      const defaultPreset = getDefaultPreset()
      // 返回时去掉 id 和 isDefault 字段，只返回配置数据
      const { id: _, isDefault: __, ...config } = defaultPreset
      return config
    }
    
    const saved = localStorage.getItem(PRESET_STORAGE_KEY)
    if (!saved) return null
    
    const presets = JSON.parse(saved)
    return presets[id] || null
  } catch (error) {
    console.error('加载方案失败:', error)
    return null
  }
}

// 删除方案
export const deletePreset = (id) => {
  try {
    // 不允许删除默认方案
    if (isDefaultPreset(id)) {
      throw new Error('默认方案不可删除')
    }
    
    const saved = localStorage.getItem(PRESET_STORAGE_KEY)
    if (!saved) return false
    
    const presets = JSON.parse(saved)
    delete presets[id]
    
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets))
    return true
  } catch (error) {
    console.error('删除方案失败:', error)
    throw error
  }
}

// 导出方案为 JSON（用于备份）
export const exportPreset = (id) => {
  // 如果是默认方案，需要特殊处理
  if (isDefaultPreset(id)) {
    const defaultPreset = getDefaultPreset()
    const { id: _, isDefault: __, ...config } = defaultPreset
    return JSON.stringify(config, null, 2)
  }
  
  const preset = loadPreset(id)
  if (!preset) return null
  
  return JSON.stringify(preset, null, 2)
}

// 导入方案（从 JSON）
export const importPreset = (jsonString) => {
  try {
    const preset = JSON.parse(jsonString)
    if (!preset.name || !preset.theme || !preset.commonConfig || !preset.chartConfigs) {
      throw new Error('无效的方案格式')
    }
    
    // 检查名称是否重复，如果重复则自动添加时间戳
    let finalName = preset.name
    if (isPresetNameDuplicate(finalName)) {
      const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      finalName = `${preset.name} (${timestamp})`
    }
    
    return savePreset(finalName, {
      theme: preset.theme,
      commonConfig: preset.commonConfig,
      chartConfigs: preset.chartConfigs,
      layout: preset.layout
    })
  } catch (error) {
    console.error('导入方案失败:', error)
    throw error
  }
}

// 保存当前方案ID
export const saveCurrentPresetId = (presetId) => {
  try {
    if (presetId) {
      localStorage.setItem(CURRENT_PRESET_ID_KEY, presetId)
    } else {
      localStorage.removeItem(CURRENT_PRESET_ID_KEY)
    }
  } catch (error) {
    console.error('保存当前方案ID失败:', error)
  }
}

// 获取当前方案ID
export const getCurrentPresetId = () => {
  try {
    return localStorage.getItem(CURRENT_PRESET_ID_KEY) || null
  } catch (error) {
    console.error('获取当前方案ID失败:', error)
    return null
  }
}

