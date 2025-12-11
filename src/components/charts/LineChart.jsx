import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { mergeCommonConfig, mergeChartConfig } from '../../utils/configMerge'
import { getConfigValueWithFallback, getSymbolConfig, getLabelConfig, getLineStyleConfig, getAreaStyleConfig } from '../../utils/configReader'
import { defaultCommonConfig } from '../../config/chartDefaults'
import { defaultChartConfigs } from '../../config/chartDefaults'
import { getColor } from '../../config/colors'
import { useTheme } from '../../context/ThemeContext'

function LineChart({ data, commonConfig, config }) {
  const { themeColors } = useTheme()
  
  const mergedCommonConfig = useMemo(() => {
    return mergeCommonConfig(defaultCommonConfig, commonConfig)
  }, [commonConfig])

  // 合并配置，用户配置优先
  const mergedConfig = useMemo(() => {
    if (!config) {
      return defaultChartConfigs.lineChart
    }
    
    // 使用优化后的合并函数，它会正确处理嵌套对象和 null 值
    return mergeChartConfig(defaultChartConfigs.lineChart, config)
  }, [config])

  const option = useMemo(() => {
    const series = []
    
    // 使用统一的配置读取工具函数
    const lineStyleConfig = getLineStyleConfig(mergedConfig)
    const areaStyleConfig = getAreaStyleConfig(mergedConfig)
    const symbolConfig = getSymbolConfig(mergedConfig)
    const labelConfig = getLabelConfig(mergedConfig)
    
    const itemStyle = mergedConfig.itemStyle || {}
    const itemColor = itemStyle.color || mergedConfig.lineStyleColor
    
    const symbolSize = mergedConfig.symbolSize || 8
    const symbolRotate = mergedConfig.symbolRotate || 0
    
    if (data.series) {
      // 维度特别多场景
      data.series.forEach((item, index) => {
        series.push({
          name: item.name,
          type: 'line',
          data: item.data,
          smooth: mergedConfig.smooth || false,
          step: mergedConfig.step === true ? 'start' : mergedConfig.step === 'start' ? 'start' : mergedConfig.step === 'middle' ? 'middle' : mergedConfig.step === 'end' ? 'end' : false,
          stack: mergedConfig.stack || undefined,
          lineStyle: {
            width: lineStyleConfig.width,
            type: lineStyleConfig.type,
            color: lineStyleConfig.color || undefined,
            opacity: lineStyleConfig.opacity
          },
          itemStyle: {
            color: itemColor || getColor(index, themeColors),
            borderColor: itemStyle.borderColor,
            borderWidth: itemStyle.borderWidth
          },
          areaStyle: areaStyleConfig.show ? {
            opacity: areaStyleConfig.opacity
          } : undefined,
          showSymbol: symbolConfig.showSymbol,
          symbol: symbolConfig.symbol,
          symbolSize: symbolSize,
          symbolRotate: symbolRotate,
          label: labelConfig.show ? {
            show: true,
            position: labelConfig.position,
            formatter: labelConfig.formatter,
            fontSize: labelConfig.fontSize,
            color: labelConfig.color
          } : { show: false }
        })
      })
    } else {
      // 正常场景
      series.push({
        name: '销售额',
        type: 'line',
        data: data.salesData,
        smooth: mergedConfig.smooth || false,
        step: mergedConfig.step === true ? 'start' : mergedConfig.step === 'start' ? 'start' : mergedConfig.step === 'middle' ? 'middle' : mergedConfig.step === 'end' ? 'end' : false,
        stack: mergedConfig.stack || undefined,
        lineStyle: {
          width: lineStyleConfig.width,
          type: lineStyleConfig.type,
          color: lineStyleConfig.color || undefined,
          opacity: lineStyleConfig.opacity
        },
        itemStyle: {
          color: itemColor || getColor(0, themeColors),
          borderColor: itemStyle.borderColor,
          borderWidth: itemStyle.borderWidth
        },
        areaStyle: areaStyleConfig.show ? {
          opacity: areaStyleConfig.opacity
        } : undefined,
        showSymbol: symbolConfig.showSymbol,
        symbol: symbolConfig.symbol,
        symbolSize: symbolSize,
        symbolRotate: symbolRotate,
        label: labelConfig.show ? {
          show: true,
          position: labelConfig.position,
          formatter: labelConfig.formatter,
          fontSize: labelConfig.fontSize,
          color: labelConfig.color
        } : { show: false }
      })
      
      if (data.profitData) {
        series.push({
          name: '利润',
          type: 'line',
          data: data.profitData,
          smooth: mergedConfig.smooth || false,
          step: mergedConfig.step === true ? 'start' : mergedConfig.step === 'start' ? 'start' : mergedConfig.step === 'middle' ? 'middle' : mergedConfig.step === 'end' ? 'end' : false,
          stack: mergedConfig.stack || undefined,
          lineStyle: {
            width: lineStyleConfig.width,
            type: lineStyleConfig.type,
            opacity: lineStyleConfig.opacity
          },
          itemStyle: {
            color: getColor(1, themeColors),
            borderColor: itemStyle.borderColor,
            borderWidth: itemStyle.borderWidth
          },
          areaStyle: areaStyleConfig.show ? {
            opacity: areaStyleConfig.opacity
          } : undefined,
          showSymbol: symbolConfig.showSymbol,
          symbol: symbolConfig.symbol,
          symbolSize: symbolSize,
          symbolRotate: symbolRotate,
          label: labelConfig.show ? {
            show: true,
            position: labelConfig.position,
            formatter: labelConfig.formatter,
            fontSize: labelConfig.fontSize,
            color: labelConfig.color
          } : { show: false }
        })
      }
    }

    return {
      tooltip: {
        ...mergedCommonConfig.tooltip,
        trigger: mergedCommonConfig.tooltip.trigger === 'axis' ? 'axis' : mergedCommonConfig.tooltip.trigger
      },
      legend: mergedConfig.showLegend ? {
        ...mergedCommonConfig.legend,
        show: true,
        data: series.map(s => s.name)
      } : { show: false },
      grid: mergedCommonConfig.grid,
      xAxis: {
        type: 'category',
        data: data.months,
        axisLabel: mergedCommonConfig.axis.label,
        axisLine: mergedCommonConfig.axis.line,
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: mergedCommonConfig.axis.label,
        axisLine: mergedCommonConfig.axis.line,
        splitLine: mergedCommonConfig.axis.splitLine
      },
      series,
      title: mergedCommonConfig.title.show ? mergedCommonConfig.title : undefined
    }
  }, [data, mergedCommonConfig, mergedConfig, themeColors])

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  )
}

export default LineChart

