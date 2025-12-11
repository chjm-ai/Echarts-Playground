// 配置合并工具函数

/**
 * 深度合并配置对象，用户配置优先
 * @param {Object} defaultConfig - 默认配置
 * @param {Object} userConfig - 用户配置
 * @returns {Object} 合并后的配置
 */
export function mergeChartConfig(defaultConfig, userConfig) {
  if (!userConfig) return defaultConfig
  
  const merged = { ...defaultConfig }
  
  for (const key in userConfig) {
    // 处理 null 值（明确设置为 null 表示禁用）
    if (userConfig[key] === null) {
      merged[key] = null
      continue
    }
    
    // 处理嵌套对象
    if (typeof userConfig[key] === 'object' && !Array.isArray(userConfig[key]) && userConfig[key] !== null) {
      // 如果默认配置中没有这个键，直接使用用户配置
      if (!merged[key]) {
        merged[key] = { ...userConfig[key] }
      } else {
        // 深度合并嵌套对象
        merged[key] = mergeChartConfig(merged[key], userConfig[key])
      }
    } else {
      // 直接覆盖
      merged[key] = userConfig[key]
    }
  }
  
  return merged
}

export function mergeCommonConfig(defaultCommon, userCommon) {
  if (!userCommon) return defaultCommon
  
  const merged = {
    tooltip: mergeChartConfig(defaultCommon.tooltip || {}, userCommon.tooltip || {}),
    legend: mergeChartConfig(defaultCommon.legend || {}, userCommon.legend || {}),
    grid: mergeChartConfig(defaultCommon.grid || {}, userCommon.grid || {}),
    title: mergeChartConfig(defaultCommon.title || {}, userCommon.title || {})
  }
  
  // 处理 legend.position 转换为 left 和 top（向后兼容）
  if (merged.legend.position && !merged.legend.left && !merged.legend.top) {
    const position = merged.legend.position
    if (position === 'left') {
      merged.legend.left = 'left'
      merged.legend.top = 'center'
    } else if (position === 'right') {
      merged.legend.left = 'right'
      merged.legend.top = 'center'
    } else if (position === 'top') {
      merged.legend.left = 'center'
      merged.legend.top = 'top'
    } else if (position === 'bottom') {
      merged.legend.left = 'center'
      merged.legend.top = 'bottom'
    }
    // 删除 position 字段，因为 ECharts 不支持
    delete merged.legend.position
  }
  
  // 合并 axis 配置，确保嵌套对象也被正确合并
  if (defaultCommon.axis || userCommon.axis) {
    merged.axis = {
      label: mergeChartConfig(
        defaultCommon.axis?.label || { color: '#6E7079', fontSize: 12 },
        userCommon.axis?.label || {}
      ),
      line: mergeChartConfig(
        defaultCommon.axis?.line || { color: '#333', width: 1, type: 'solid' },
        userCommon.axis?.line || {}
      ),
      splitLine: mergeChartConfig(
        defaultCommon.axis?.splitLine || { show: true, color: '#ccc', width: 1, type: 'solid' },
        userCommon.axis?.splitLine || {}
      )
    }
  }
  
  return merged
}

