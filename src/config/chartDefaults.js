// 图表默认配置
// 使用 ECharts 官方默认配置

export const defaultCommonConfig = {
  // 通用 tooltip 配置（ECharts 默认值）
  tooltip: {
    trigger: 'axis', // 'item' | 'axis' | 'none'
    backgroundColor: 'rgba(50, 50, 93, 0.88)', // ECharts 默认半透明背景
    borderColor: 'rgba(255, 255, 255, 0.2)', // ECharts 默认边框颜色
    borderWidth: 0,
    textStyle: {
      color: '#fff', // ECharts 默认文字颜色（白色）
      fontSize: 12
    },
    axisPointer: {
      type: 'line', // 'line' | 'shadow' | 'none' | 'cross'
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.2)', // ECharts 默认指示线颜色
        width: 1,
        type: 'solid' // ECharts 默认是实线
      }
    }
  },
  
  // 通用 legend 配置（ECharts 默认值）
  legend: {
    show: true,
    left: 'center', // ECharts 默认居中
    top: 'top', // ECharts 默认在顶部
    orient: 'horizontal', // 'horizontal' | 'vertical'
    itemGap: 10, // 图例项间距
    textStyle: {
      color: '#333', // ECharts 默认文字颜色
      fontSize: 12
    },
    // 兼容性字段：position 会被转换为 left 和 top
    position: 'top' // 'top' | 'bottom' | 'left' | 'right'
  },
  
  // 通用 grid 配置（ECharts 默认值）
  grid: {
    show: false, // 是否显示网格背景
    left: 60, // ECharts 默认左边距
    right: 60, // ECharts 默认右边距
    top: 60, // ECharts 默认上边距
    bottom: 60, // ECharts 默认下边距
    containLabel: false // ECharts 默认不包含坐标轴标签
  },
  
  // 坐标轴配置（ECharts 默认值）
  axis: {
    // 坐标轴标签（文字）配置
    label: {
      color: '#6E7079', // ECharts 默认标签颜色
      fontSize: 12,
      rotate: 0, // 旋转角度
      show: true // 是否显示
    },
    // 坐标轴线配置
    line: {
      show: true, // 是否显示轴线
      color: '#333', // ECharts 默认轴线颜色
      width: 1,
      type: 'solid' // 'solid' | 'dashed' | 'dotted'
    },
    // 网格线配置（主要是 yAxis 的 splitLine）
    splitLine: {
      show: true,
      color: '#ccc', // ECharts 默认分割线颜色
      width: 1,
      type: 'solid' // ECharts 默认是实线
    }
  },
  
  // 标题配置
  title: {
    show: false, // 是否显示标题
    text: '',
    subtext: '',
    left: 'center', // 'left' | 'center' | 'right' | number | string
    top: 'top', // 'top' | 'middle' | 'bottom' | number | string
    textStyle: {
      color: '#333',
      fontSize: 18,
      fontWeight: 'bold'
    },
    subtextStyle: {
      color: '#666',
      fontSize: 14
    }
  }
}

// 各图表类型的默认配置
export const defaultChartConfigs = {
  lineChart: {
    showLabel: false,
    showLegend: true,
    smooth: false, // ECharts 默认不平滑
    lineWidth: 2, // ECharts 默认线宽
    lineStyleType: 'solid', // 'solid' | 'dashed' | 'dotted'
    lineStyleColor: null, // null 表示使用默认颜色
    showSymbol: true, // ECharts 默认显示标记点
    symbol: 'circle', // 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none'
    symbolSize: 4, // ECharts 默认标记点大小
    showArea: false, // ECharts 默认不显示区域填充
    areaOpacity: [0.3, 0.1],
    step: false, // 阶梯线图
    stack: null, // 堆叠，null 表示不堆叠
    // 标签详细配置
    labelPosition: 'top', // 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom'
    labelFormatter: '{c}',
    labelFontSize: 12,
    labelColor: '#000' // ECharts 默认标签颜色
  },
  
  barChart: {
    showLabel: false,
    showLegend: true,
    borderRadius: [0, 0, 0, 0], // ECharts 默认无圆角，数组格式：[topLeft, topRight, bottomRight, bottomLeft]
    barMaxWidth: null, // ECharts 默认不限制最大宽度
    barWidth: null, // 固定宽度，null 表示自适应
    barMinHeight: 0, // 最小高度
    barGap: '30%', // ECharts 默认柱间距离
    barCategoryGap: '20%', // ECharts 默认类目间距离
    // 标签详细配置
    labelPosition: 'top', // 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom'
    labelFormatter: '{c}',
    labelFontSize: 12,
    labelColor: '#000' // ECharts 默认标签颜色
  },
  
  pieChart: {
    showLabel: true,
    showLegend: true,
    labelPosition: 'outside', // 'outside' | 'inside' | 'inner'
    labelFormatter: '{b}\n{d}%',
    labelFontSize: 12,
    labelColor: '#000', // ECharts 默认标签颜色
    borderRadius: 0, // ECharts 默认无圆角
    center: ['50%', '50%'], // ECharts 默认居中
    radius: ['0%', '75%'], // ECharts 默认半径
    showLabelLine: true,
    labelLineLength: 10, // ECharts 默认引导线第一段长度
    labelLineLength2: 7, // ECharts 默认引导线第二段长度
    legendPosition: 'left',
    roseType: null, // 'radius' | 'area' | null
    startAngle: 90, // 起始角度
    minAngle: 0, // 最小角度
    selectedMode: false // 选中模式
  },
  
  scatterChart: {
    showLabel: false,
    showLegend: true,
    symbolSize: 10, // ECharts 默认标记点大小
    symbol: 'circle', // 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none'
    opacity: 1, // ECharts 默认不透明
    large: false, // 大数据量优化
    largeThreshold: 2000, // 大数据量阈值
    // 标签详细配置
    labelPosition: 'right',
    labelFormatter: '{c}',
    labelFontSize: 12,
    labelColor: '#000' // ECharts 默认标签颜色
  },
  
  radarChart: {
    showLabel: false,
    showLegend: true,
    center: ['50%', '50%'], // ECharts 默认居中
    radius: '75%', // ECharts 默认半径
    areaOpacity: 0, // ECharts 默认不显示区域填充
    areaOpacityHover: 0.3, // ECharts 默认悬停透明度
    startAngle: 90, // 起始角度
    nameGap: 15, // 名称与轴线距离
    splitNumber: 5, // 分割段数
    shape: 'polygon', // 'polygon' | 'circle'
    scale: false, // 是否显示刻度
    axisNameShow: true, // 是否显示轴名称
    axisNameFontSize: 12, // ECharts 默认字体大小
    axisNameColor: '#333' // ECharts 默认颜色
  },
  
  stackedBarChart: {
    showLabel: false,
    showLegend: true,
    borderRadius: {
      first: [0, 0, 0, 0], // ECharts 默认无圆角
      last: [0, 0, 0, 0],
      middle: [0, 0, 0, 0]
    },
    barMaxWidth: null, // ECharts 默认不限制最大宽度
    barWidth: null,
    barGap: '30%', // ECharts 默认柱间距离
    barCategoryGap: '20%', // ECharts 默认类目间距离
    // 标签详细配置
    labelPosition: 'top',
    labelFormatter: '{c}',
    labelFontSize: 12,
    labelColor: '#000' // ECharts 默认标签颜色
  },
  
  horizontalBarChart: {
    showLabel: false,
    showLegend: false,
    borderRadius: [0, 0, 0, 0], // ECharts 默认无圆角，数组格式：[topLeft, topRight, bottomRight, bottomLeft]
    barMaxWidth: null, // ECharts 默认不限制最大宽度
    barWidth: null,
    barMinHeight: 0,
    barGap: '30%', // ECharts 默认柱间距离
    barCategoryGap: '20%', // ECharts 默认类目间距离
    // 标签详细配置
    labelPosition: 'right',
    labelFormatter: '{c}',
    labelFontSize: 12,
    labelColor: '#000' // ECharts 默认标签颜色
  }
}

