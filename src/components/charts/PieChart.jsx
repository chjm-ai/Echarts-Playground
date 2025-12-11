import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { mergeCommonConfig, mergeChartConfig } from '../../utils/configMerge'
import { defaultCommonConfig } from '../../config/chartDefaults'
import { defaultChartConfigs } from '../../config/chartDefaults'
import { getColor } from '../../config/colors'
import { useTheme } from '../../context/ThemeContext'

function PieChart({ data, commonConfig, config }) {
  const { themeColors } = useTheme()
  
  const mergedCommonConfig = useMemo(() => {
    return mergeCommonConfig(defaultCommonConfig, commonConfig)
  }, [commonConfig])

  const mergedConfig = useMemo(() => {
    return mergeChartConfig(defaultChartConfigs.pieChart, config)
  }, [config])

  const option = useMemo(() => {
    const pieData = data.data.map((item, index) => ({
      ...item,
      itemStyle: {
        color: getColor(index, themeColors)
      }
    }))

    return {
      tooltip: {
        ...mergedCommonConfig.tooltip,
        trigger: 'item'
      },
      legend: mergedConfig.showLegend ? {
        ...mergedCommonConfig.legend,
        show: true,
        orient: mergedConfig.legendPosition === 'left' ? 'vertical' : mergedCommonConfig.legend.orient || 'horizontal',
        left: mergedConfig.legendPosition === 'left' ? 'left' : mergedCommonConfig.legend.left || 'center',
        top: mergedConfig.legendPosition === 'left' ? 'center' : mergedCommonConfig.legend.top || 'top',
        data: pieData.map(item => item.name)
      } : { show: false },
      series: [{
        name: '数据',
        type: 'pie',
        radius: mergedConfig.radius,
        center: mergedConfig.center,
        data: pieData,
        roseType: mergedConfig.roseType || undefined,
        startAngle: mergedConfig.startAngle,
        minAngle: mergedConfig.minAngle,
        selectedMode: mergedConfig.selectedMode ? 'single' : false,
        label: mergedConfig.showLabel ? {
          show: true,
          position: mergedConfig.labelPosition,
          formatter: mergedConfig.labelFormatter,
          fontSize: mergedConfig.labelFontSize,
          color: mergedConfig.labelColor
        } : { show: false },
        labelLine: mergedConfig.showLabelLine ? {
          show: true,
          length: mergedConfig.labelLineLength,
          length2: mergedConfig.labelLineLength2
        } : { show: false },
        itemStyle: {
          borderRadius: mergedConfig.borderRadius
        }
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

export default PieChart

