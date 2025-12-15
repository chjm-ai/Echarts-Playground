import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { mergeCommonConfig, mergeChartConfig } from '../../utils/configMerge'
import { defaultCommonConfig } from '../../config/chartDefaults'
import { defaultChartConfigs } from '../../config/chartDefaults'
import { getColor } from '../../config/colors'
import { useTheme } from '../../context/ThemeContext'

function BarChart({ data, commonConfig, config }) {
  const { themeColors } = useTheme()
  
  const mergedCommonConfig = useMemo(() => {
    return mergeCommonConfig(defaultCommonConfig, commonConfig)
  }, [commonConfig])

  const mergedConfig = useMemo(() => {
    return mergeChartConfig(defaultChartConfigs.barChart, config)
  }, [config])

  const option = useMemo(() => {
    const series = []
    
    if (data.series) {
      // 维度特别多场景
      data.series.forEach((item, index) => {
        series.push({
          name: item.name,
          type: 'bar',
          data: item.data,
          itemStyle: {
            color: getColor(index, themeColors),
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
        })
      })
    } else {
      // 正常场景
      series.push({
        name: 'Q1',
        type: 'bar',
        data: data.q1Data,
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
      })
      
      if (data.q2Data) {
        series.push({
          name: 'Q2',
          type: 'bar',
          data: data.q2Data,
          itemStyle: {
            color: getColor(1, themeColors),
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
        })
      }
      
      if (data.q3Data) {
        series.push({
          name: 'Q3',
          type: 'bar',
          data: data.q3Data,
          itemStyle: {
            color: getColor(2, themeColors),
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
        data: data.products,
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
      barGap: mergedConfig.barGap,
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

export default BarChart

