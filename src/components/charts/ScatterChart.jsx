import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { mergeCommonConfig, mergeChartConfig } from '../../utils/configMerge'
import { defaultCommonConfig } from '../../config/chartDefaults'
import { defaultChartConfigs } from '../../config/chartDefaults'
import { getColor } from '../../config/colors'
import { useTheme } from '../../context/ThemeContext'

function ScatterChart({ data, commonConfig, config }) {
  const { themeColors } = useTheme()
  
  const mergedCommonConfig = useMemo(() => {
    return mergeCommonConfig(defaultCommonConfig, commonConfig)
  }, [commonConfig])

  const mergedConfig = useMemo(() => {
    return mergeChartConfig(defaultChartConfigs.scatterChart, config)
  }, [config])

  const option = useMemo(() => {
    const series = []
    
    if (data.categories) {
      // 维度特别多场景
      data.categories.forEach((category, index) => {
        series.push({
          name: category.name,
          type: 'scatter',
          data: category.data,
          symbolSize: mergedConfig.symbolSize,
          symbol: mergedConfig.symbol,
          itemStyle: {
            color: getColor(index, themeColors),
            opacity: mergedConfig.opacity
          },
          large: mergedConfig.large,
          largeThreshold: mergedConfig.largeThreshold,
          label: mergedConfig.showLabel ? {
            show: true,
            position: mergedConfig.labelPosition,
            formatter: mergedConfig.labelFormatter,
            fontSize: mergedConfig.labelFontSize,
            color: mergedConfig.labelColor
          } : { show: false }
        })
      })
    } else {
      // 正常场景
      if (data.categoryA) {
        series.push({
          name: '类别A',
          type: 'scatter',
          data: data.categoryA,
          symbolSize: mergedConfig.symbolSize,
          symbol: mergedConfig.symbol,
          itemStyle: {
            color: getColor(0, themeColors),
            opacity: mergedConfig.opacity
          },
          large: mergedConfig.large,
          largeThreshold: mergedConfig.largeThreshold,
          label: mergedConfig.showLabel ? {
            show: true,
            position: mergedConfig.labelPosition,
            formatter: mergedConfig.labelFormatter,
            fontSize: mergedConfig.labelFontSize,
            color: mergedConfig.labelColor
          } : { show: false }
        })
      }
      
      if (data.categoryB) {
        series.push({
          name: '类别B',
          type: 'scatter',
          data: data.categoryB,
          symbolSize: mergedConfig.symbolSize,
          symbol: mergedConfig.symbol,
          itemStyle: {
            color: getColor(1, themeColors),
            opacity: mergedConfig.opacity
          },
          large: mergedConfig.large,
          largeThreshold: mergedConfig.largeThreshold,
          label: mergedConfig.showLabel ? {
            show: true,
            position: mergedConfig.labelPosition,
            formatter: mergedConfig.labelFormatter,
            fontSize: mergedConfig.labelFontSize,
            color: mergedConfig.labelColor
          } : { show: false }
        })
      }
      
      if (data.categoryC) {
        series.push({
          name: '类别C',
          type: 'scatter',
          data: data.categoryC,
          symbolSize: mergedConfig.symbolSize,
          symbol: mergedConfig.symbol,
          itemStyle: {
            color: getColor(2, themeColors),
            opacity: mergedConfig.opacity
          },
          large: mergedConfig.large,
          largeThreshold: mergedConfig.largeThreshold,
          label: mergedConfig.showLabel ? {
            show: true,
            position: mergedConfig.labelPosition,
            formatter: mergedConfig.labelFormatter,
            fontSize: mergedConfig.labelFontSize,
            color: mergedConfig.labelColor
          } : { show: false }
        })
      }
    }

    return {
      tooltip: {
        ...mergedCommonConfig.tooltip,
        trigger: 'item'
      },
      legend: mergedConfig.showLegend ? {
        ...mergedCommonConfig.legend,
        show: true,
        data: series.map(s => s.name)
      } : { show: false },
      grid: mergedCommonConfig.grid,
      xAxis: {
        type: 'value',
        axisLabel: mergedCommonConfig.axis.label,
        axisLine: mergedCommonConfig.axis.line,
        splitLine: mergedCommonConfig.axis.splitLine
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

export default ScatterChart

