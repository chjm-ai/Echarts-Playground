// 配置比较工具函数
// 用于检测配置是否被修改

/**
 * 深度比较两个对象是否相同
 * @param {*} obj1 - 第一个对象
 * @param {*} obj2 - 第二个对象
 * @returns {boolean} 是否相同
 */
export function deepEqual(obj1, obj2) {
  // 如果两个值严格相等，返回 true
  if (obj1 === obj2) {
    return true
  }

  // 如果其中一个是 null 或 undefined，另一个不是，返回 false
  if (obj1 == null || obj2 == null) {
    return obj1 === obj2
  }

  // 如果类型不同，返回 false
  if (typeof obj1 !== typeof obj2) {
    return false
  }

  // 如果是基本类型，直接比较
  if (typeof obj1 !== 'object') {
    return obj1 === obj2
  }

  // 如果是数组
  if (Array.isArray(obj1) || Array.isArray(obj2)) {
    if (!Array.isArray(obj1) || !Array.isArray(obj2)) {
      return false
    }
    if (obj1.length !== obj2.length) {
      return false
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false
      }
    }
    return true
  }

  // 如果是对象，比较所有键
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false
    }
    if (!deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

/**
 * 比较两个完整配置方案是否相同
 * @param {Object} config1 - 第一个配置方案
 * @param {Object} config2 - 第二个配置方案
 * @returns {boolean} 是否相同
 */
export function comparePresetConfigs(config1, config2) {
  if (!config1 || !config2) {
    return config1 === config2
  }

  // 比较主题
  if (!deepEqual(config1.theme, config2.theme)) {
    return false
  }

  // 比较通用配置
  if (!deepEqual(config1.commonConfig, config2.commonConfig)) {
    return false
  }

  // 比较图表配置
  if (!deepEqual(config1.chartConfigs, config2.chartConfigs)) {
    return false
  }

  // 比较布局配置
  if (!deepEqual(config1.layout, config2.layout)) {
    return false
  }

  return true
}

