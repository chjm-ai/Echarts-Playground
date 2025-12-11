import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { mergeCommonConfig, mergeChartConfig } from '../../utils/configMerge'
import { defaultCommonConfig } from '../../config/chartDefaults'
import { defaultChartConfigs } from '../../config/chartDefaults'
import { getColor } from '../../config/colors'
import { useTheme } from '../../context/ThemeContext'

function StackedBarChart({ data, commonConfig, config }) {
  const { themeColors } = useTheme()
  
  const mergedCommonConfig = useMemo(() => {
    return mergeCommonConfig(defaultCommonConfig, commonConfig)
  }, [commonConfig])

  const mergedConfig = useMemo(() => {
    return mergeChartConfig(defaultChartConfigs.stackedBarChart, config)
  }, [config])

  const option = useMemo(() => {
    const series = []
    
    if (data.categories) {
      // 维度特别多场景
      data.categories.forEach((category, index) => {
        const isFirst = index === 0
        const isLast = index === data.categories.length - 1
        const borderRadius = isFirst 
          ? mergedConfig.borderRadius.first 
          : isLast 
          ? mergedConfig.borderRadius.last 
          : mergedConfig.borderRadius.middle
        
        series.push({
          name: category.name,
          type: 'bar',
          stack: 'total',
          data: category.data,
          itemStyle: {
            color: getColor(index, themeColors),
            borderRadius: borderRadius
          },
          barMaxWidth: mergedConfig.barMaxWidth,
          barWidth: mergedConfig.barWidth,
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
          type: 'bar',
          stack: 'total',
          data: data.categoryA,
          itemStyle: {
            color: getColor(0, themeColors),
            borderRadius: mergedConfig.borderRadius.first
          },
          barMaxWidth: mergedConfig.barMaxWidth,
          barWidth: mergedConfig.barWidth,
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
          type: 'bar',
          stack: 'total',
          data: data.categoryB,
          itemStyle: {
            color: getColor(1, themeColors),
            borderRadius: mergedConfig.borderRadius.middle
          },
          barMaxWidth: mergedConfig.barMaxWidth,
          barWidth: mergedConfig.barWidth,
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
          type: 'bar',
          stack: 'total',
          data: data.categoryC,
          itemStyle: {
            color: getColor(2, themeColors),
            borderRadius: mergedConfig.borderRadius.last
          },
          barMaxWidth: mergedConfig.barMaxWidth,
          barWidth: mergedConfig.barWidth,
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
      tooltip: mergedCommonConfig.tooltip,
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

export default StackedBarChart

