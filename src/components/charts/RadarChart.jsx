import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { mergeCommonConfig, mergeChartConfig } from '../../utils/configMerge'
import { defaultCommonConfig } from '../../config/chartDefaults'
import { defaultChartConfigs } from '../../config/chartDefaults'
import { getColor } from '../../config/colors'
import { useTheme } from '../../context/ThemeContext'

function RadarChart({ data, commonConfig, config }) {
  const { themeColors } = useTheme()
  
  const mergedCommonConfig = useMemo(() => {
    return mergeCommonConfig(defaultCommonConfig, commonConfig)
  }, [commonConfig])

  const mergedConfig = useMemo(() => {
    return mergeChartConfig(defaultChartConfigs.radarChart, config)
  }, [config])

  const option = useMemo(() => {
    const series = []
    
    if (data.products) {
      // 维度特别多场景
      data.products.forEach((product, index) => {
        series.push({
          name: product.name,
          type: 'radar',
          data: [{
            value: product.data,
            name: product.name,
            areaStyle: {
              opacity: mergedConfig.areaOpacity
            },
            itemStyle: {
              color: getColor(index, themeColors)
            },
            lineStyle: {
              color: getColor(index, themeColors)
            }
          }]
        })
      })
    } else {
      // 正常场景
      if (data.productA) {
        series.push({
          name: '产品A',
          type: 'radar',
          data: [{
            value: data.productA,
            name: '产品A',
            areaStyle: {
              opacity: mergedConfig.areaOpacity
            },
            itemStyle: {
              color: getColor(0, themeColors)
            },
            lineStyle: {
              color: getColor(0, themeColors)
            }
          }]
        })
      }
      
      if (data.productB) {
        series.push({
          name: '产品B',
          type: 'radar',
          data: [{
            value: data.productB,
            name: '产品B',
            areaStyle: {
              opacity: mergedConfig.areaOpacity
            },
            itemStyle: {
              color: getColor(1, themeColors)
            },
            lineStyle: {
              color: getColor(1, themeColors)
            }
          }]
        })
      }
      
      if (data.productC) {
        series.push({
          name: '产品C',
          type: 'radar',
          data: [{
            value: data.productC,
            name: '产品C',
            areaStyle: {
              opacity: mergedConfig.areaOpacity
            },
            itemStyle: {
              color: getColor(2, themeColors)
            },
            lineStyle: {
              color: getColor(2, themeColors)
            }
          }]
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
      radar: {
        center: mergedConfig.center,
        radius: mergedConfig.radius,
        startAngle: mergedConfig.startAngle,
        nameGap: mergedConfig.nameGap,
        splitNumber: mergedConfig.splitNumber,
        shape: mergedConfig.shape,
        scale: mergedConfig.scale,
        indicator: data.indicators,
        name: {
          show: mergedConfig.axisNameShow,
          fontSize: mergedConfig.axisNameFontSize,
          color: mergedConfig.axisNameColor
        },
        axisLine: mergedCommonConfig.axis.line,
        splitLine: mergedCommonConfig.axis.splitLine,
        splitArea: {
          show: false
        }
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

export default RadarChart

