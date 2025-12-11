// 配置读取工具函数
// 统一处理配置的读取逻辑，避免重复代码和错误

/**
 * 从配置对象中读取嵌套值
 * @param {Object} config - 配置对象
 * @param {string} path - 路径，如 'lineStyle.width' 或 'label.position'
 * @param {*} defaultValue - 默认值
 * @returns {*} 配置值或默认值
 */
export function getConfigValue(config, path, defaultValue) {
  if (!config) return defaultValue
  
  const keys = path.split('.')
  let value = config
  
  for (const key of keys) {
    if (value === null || value === undefined) {
      return defaultValue
    }
    value = value[key]
  }
  
  // 如果值是 undefined 或 null，返回默认值
  return value !== undefined && value !== null ? value : defaultValue
}

/**
 * 读取配置值，支持新旧两种格式
 * @param {Object} config - 配置对象
 * @param {string} newPath - 新格式路径，如 'label.position'
 * @param {string} oldPath - 旧格式路径，如 'labelPosition'
 * @param {*} defaultValue - 默认值
 * @returns {*} 配置值或默认值
 */
export function getConfigValueWithFallback(config, newPath, oldPath, defaultValue) {
  // 优先使用新格式（嵌套格式）
  const newValue = getConfigValue(config, newPath, undefined)
  if (newValue !== undefined && newValue !== null) {
    return newValue
  }
  
  // 如果没有新格式，使用旧格式
  const oldValue = getConfigValue(config, oldPath, undefined)
  if (oldValue !== undefined && oldValue !== null) {
    return oldValue
  }
  
  // 都没有则返回默认值
  return defaultValue
}

/**
 * 读取 symbol 配置，正确处理 'none' 值
 * @param {Object} config - 配置对象
 * @returns {Object} { symbol: string, showSymbol: boolean }
 */
export function getSymbolConfig(config) {
  const symbol = getConfigValue(config, 'symbol', undefined)
  const showSymbol = getConfigValue(config, 'showSymbol', undefined)
  
  // 如果 symbol 明确设置为 'none'，则隐藏
  if (symbol === 'none') {
    return { symbol: 'none', showSymbol: false }
  }
  
  // 如果 symbol 有值且不是 'none'，则显示
  if (symbol && symbol !== 'none') {
    return { symbol, showSymbol: true }
  }
  
  // 如果 showSymbol 明确设置为 false，则隐藏
  if (showSymbol === false) {
    return { symbol: 'none', showSymbol: false }
  }
  
  // 如果 showSymbol 明确设置为 true，则显示
  if (showSymbol === true) {
    return { symbol: symbol || 'circle', showSymbol: true }
  }
  
  // 默认不显示
  return { symbol: 'none', showSymbol: false }
}

/**
 * 读取 label 配置
 * @param {Object} config - 配置对象
 * @returns {Object} label 配置对象
 */
export function getLabelConfig(config) {
  const label = getConfigValue(config, 'label', {})
  const showLabel = getConfigValueWithFallback(config, 'label.show', 'showLabel', false)
  
  return {
    show: showLabel,
    position: getConfigValueWithFallback(config, 'label.position', 'labelPosition', 'top'),
    formatter: getConfigValueWithFallback(config, 'label.formatter', 'labelFormatter', '{c}'),
    fontSize: getConfigValueWithFallback(config, 'label.fontSize', 'labelFontSize', 12),
    color: getConfigValueWithFallback(config, 'label.color', 'labelColor', '#333')
  }
}

/**
 * 读取 lineStyle 配置
 * @param {Object} config - 配置对象
 * @returns {Object} lineStyle 配置对象
 */
export function getLineStyleConfig(config) {
  const lineStyle = getConfigValue(config, 'lineStyle', {})
  
  return {
    width: getConfigValueWithFallback(config, 'lineStyle.width', 'lineWidth', 2),
    type: getConfigValueWithFallback(config, 'lineStyle.type', 'lineStyleType', 'solid'),
    color: getConfigValueWithFallback(config, 'lineStyle.color', 'lineStyleColor', undefined),
    opacity: getConfigValue(config, 'lineStyle.opacity', 1)
  }
}

/**
 * 读取 areaStyle 配置
 * @param {Object} config - 配置对象
 * @returns {Object} { show: boolean, opacity: number }
 */
export function getAreaStyleConfig(config) {
  const areaStyle = getConfigValue(config, 'areaStyle', undefined)
  const showArea = getConfigValue(config, 'showArea', false)
  
  // 如果 areaStyle 是 null，明确表示不显示
  if (areaStyle === null) {
    return { show: false, opacity: 0.3 }
  }
  
  // 如果 areaStyle 是对象，表示显示
  if (areaStyle && typeof areaStyle === 'object') {
    return {
      show: true,
      opacity: getConfigValue(areaStyle, 'opacity', getConfigValue(config, 'areaOpacity.0', 0.3))
    }
  }
  
  // 如果 showArea 为 true，但 areaStyle 不存在，使用默认值
  if (showArea) {
    return {
      show: true,
      opacity: getConfigValue(config, 'areaOpacity.0', 0.3)
    }
  }
  
  return { show: false, opacity: 0.3 }
}

