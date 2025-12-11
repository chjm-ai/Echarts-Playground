import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { mergeCommonConfig, mergeChartConfig } from '../../utils/configMerge'
import { defaultCommonConfig } from '../../config/chartDefaults'
import { defaultChartConfigs } from '../../config/chartDefaults'
import { getColor } from '../../config/colors'
import { useTheme } from '../../context/ThemeContext'

function HorizontalBarChart({ data, commonConfig, config }) {
  const { themeColors } = useTheme()
  
  const mergedCommonConfig = useMemo(() => {
    return mergeCommonConfig(defaultCommonConfig, commonConfig)
  }, [commonConfig])

  const mergedConfig = useMemo(() => {
    return mergeChartConfig(defaultChartConfigs.horizontalBarChart, config)
  }, [config])

  const option = useMemo(() => {
    return {
      tooltip: mergedCommonConfig.tooltip,
      legend: mergedConfig.showLegend ? {
        ...mergedCommonConfig.legend,
        show: true
      } : { show: false },
      grid: mergedCommonConfig.grid,
      xAxis: {
        type: 'value',
        axisLabel: mergedCommonConfig.axis.label,
        axisLine: mergedCommonConfig.axis.line,
        splitLine: mergedCommonConfig.axis.splitLine
      },
      yAxis: {
        type: 'category',
        data: data.products,
        axisLabel: mergedCommonConfig.axis.label,
        axisLine: mergedCommonConfig.axis.line,
        splitLine: { show: false }
      },
      series: [{
        name: '销售额',
        type: 'bar',
        data: data.salesData,
        itemStyle: {
          color: getColor(0, themeColors),
          borderRadius: mergedConfig.borderRadius
        },
        barMaxWidth: mergedConfig.barMaxWidth,
        barWidth: mergedConfig.barWidth,
        barMinHeight: mergedConfig.barMinHeight,
        label: mergedConfig.showLabel ? {
          show: true,
          position: mergedConfig.labelPosition,
          formatter: mergedConfig.labelFormatter,
          fontSize: mergedConfig.labelFontSize,
          color: mergedConfig.labelColor
        } : { show: false }
      }],
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

export default HorizontalBarChart

