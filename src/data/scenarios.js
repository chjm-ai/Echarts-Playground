// 数据场景配置

// 生成随机数据的辅助函数
const generateRandomData = (count, min, max) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

// 生成月份数组
const generateMonths = (count) => {
  return Array.from({ length: count }, (_, i) => `${i + 1}月`)
}

// 生成产品名称数组
const generateProducts = (count, prefix = '产品') => {
  return Array.from({ length: count }, (_, i) => `${prefix}${String.fromCharCode(65 + i)}`)
}

// 生成散点数据
const generateScatterData = (count, baseX, baseY, variance) => {
  const data = []
  for (let i = 0; i < count; i++) {
    const x = baseX + (Math.random() - 0.5) * variance
    const y = baseY + (Math.random() - 0.5) * variance
    data.push([x, y])
  }
  return data
}

export const dataScenarios = {
  // 正常数据场景
  normal: {
    lineChart: {
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      salesData: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330],
      profitData: [20, 32, 21, 34, 10, 30, 20, 18, 19, 24, 29, 33]
    },
    barChart: {
      products: ['产品A', '产品B', '产品C', '产品D', '产品E', '产品F'],
      q1Data: [320, 302, 301, 334, 390, 330],
      q2Data: [220, 182, 191, 234, 290, 330],
      q3Data: [150, 232, 201, 154, 190, 330]
    },
    pieChart: {
      data: [
        { value: 335, name: '产品A' },
        { value: 310, name: '产品B' },
        { value: 234, name: '产品C' },
        { value: 135, name: '产品D' },
        { value: 154, name: '产品E' }
      ]
    },
    scatterChart: {
      categoryA: generateScatterData(50, 160, 55, 25),
      categoryB: generateScatterData(50, 170, 65, 30),
      categoryC: generateScatterData(50, 180, 75, 35)
    },
    radarChart: {
      indicators: [
        { name: '性能', max: 100 },
        { name: '易用性', max: 100 },
        { name: '功能', max: 100 },
        { name: '设计', max: 100 },
        { name: '价格', max: 100 },
        { name: '服务', max: 100 }
      ],
      productA: [85, 90, 80, 75, 70, 88],
      productB: [70, 75, 90, 85, 95, 80],
      productC: [90, 80, 75, 90, 65, 75]
    },
    stackedBarChart: {
      months: ['1月', '2月', '3月', '4月', '5月', '6月'],
      categoryA: [120, 132, 101, 134, 90, 230],
      categoryB: [220, 182, 191, 234, 290, 330],
      categoryC: [150, 232, 201, 154, 190, 280]
    },
    horizontalBarChart: {
      products: ['产品A', '产品B', '产品C', '产品D', '产品E', '产品F'],
      salesData: [320, 302, 301, 334, 390, 330]
    }
  },
  
  // 数据非常多场景
  many: {
    lineChart: {
      months: generateMonths(24), // 24个月
      salesData: generateRandomData(24, 100, 500),
      profitData: generateRandomData(24, 10, 100)
    },
    barChart: {
      products: generateProducts(20), // 20个产品
      q1Data: generateRandomData(20, 200, 500),
      q2Data: generateRandomData(20, 150, 450),
      q3Data: generateRandomData(20, 100, 400)
    },
    pieChart: {
      data: Array.from({ length: 15 }, (_, i) => ({
        value: Math.floor(Math.random() * 300) + 50,
        name: `产品${String.fromCharCode(65 + i)}`
      }))
    },
    scatterChart: {
      categoryA: generateScatterData(200, 160, 55, 25),
      categoryB: generateScatterData(200, 170, 65, 30),
      categoryC: generateScatterData(200, 180, 75, 35)
    },
    radarChart: {
      indicators: [
        { name: '性能', max: 100 },
        { name: '易用性', max: 100 },
        { name: '功能', max: 100 },
        { name: '设计', max: 100 },
        { name: '价格', max: 100 },
        { name: '服务', max: 100 },
        { name: '安全', max: 100 },
        { name: '速度', max: 100 }
      ],
      productA: generateRandomData(8, 60, 95),
      productB: generateRandomData(8, 60, 95),
      productC: generateRandomData(8, 60, 95)
    },
    stackedBarChart: {
      months: generateMonths(18), // 18个月
      categoryA: generateRandomData(18, 100, 300),
      categoryB: generateRandomData(18, 150, 350),
      categoryC: generateRandomData(18, 80, 280)
    },
    horizontalBarChart: {
      products: generateProducts(15), // 15个产品
      salesData: generateRandomData(15, 200, 500)
    }
  },
  
  // 数据非常少场景
  few: {
    lineChart: {
      months: ['1月', '2月', '3月'],
      salesData: [120, 132, 101],
      profitData: [20, 32, 21]
    },
    barChart: {
      products: ['产品A', '产品B'],
      q1Data: [320, 302],
      q2Data: [220, 182],
      q3Data: [150, 232]
    },
    pieChart: {
      data: [
        { value: 335, name: '产品A' },
        { value: 310, name: '产品B' }
      ]
    },
    scatterChart: {
      categoryA: generateScatterData(10, 160, 55, 25),
      categoryB: generateScatterData(10, 170, 65, 30),
      categoryC: generateScatterData(10, 180, 75, 35)
    },
    radarChart: {
      indicators: [
        { name: '性能', max: 100 },
        { name: '易用性', max: 100 },
        { name: '功能', max: 100 }
      ],
      productA: [85, 90, 80],
      productB: [70, 75, 90],
      productC: [90, 80, 75]
    },
    stackedBarChart: {
      months: ['1月', '2月'],
      categoryA: [120, 132],
      categoryB: [220, 182],
      categoryC: [150, 232]
    },
    horizontalBarChart: {
      products: ['产品A', '产品B'],
      salesData: [320, 302]
    }
  },
  
  // 维度特别多场景
  dimensions: {
    lineChart: {
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      series: [
        { name: '销售额', data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330] },
        { name: '利润', data: [20, 32, 21, 34, 10, 30, 20, 18, 19, 24, 29, 33] },
        { name: '成本', data: [100, 100, 80, 100, 80, 200, 190, 164, 172, 210, 261, 297] },
        { name: '营销', data: [30, 35, 28, 40, 25, 50, 45, 38, 42, 48, 55, 60] },
        { name: '研发', data: [50, 55, 48, 60, 45, 70, 65, 58, 62, 68, 75, 80] },
        { name: '运营', data: [40, 42, 38, 45, 35, 55, 50, 45, 48, 52, 58, 62] },
        { name: '客服', data: [25, 28, 22, 30, 20, 35, 32, 28, 30, 35, 40, 42] },
        { name: '物流', data: [35, 38, 32, 40, 30, 45, 42, 38, 40, 45, 50, 52] }
      ]
    },
    barChart: {
      products: ['产品A', '产品B', '产品C', '产品D', '产品E', '产品F'],
      series: [
        { name: 'Q1', data: [320, 302, 301, 334, 390, 330] },
        { name: 'Q2', data: [220, 182, 191, 234, 290, 330] },
        { name: 'Q3', data: [150, 232, 201, 154, 190, 330] },
        { name: 'Q4', data: [280, 250, 240, 280, 320, 300] },
        { name: 'Q5', data: [200, 180, 190, 220, 250, 280] },
        { name: 'Q6', data: [180, 160, 170, 200, 230, 260] },
        { name: 'Q7', data: [160, 140, 150, 180, 210, 240] },
        { name: 'Q8', data: [140, 120, 130, 160, 190, 220] }
      ]
    },
    pieChart: {
      data: Array.from({ length: 12 }, (_, i) => ({
        value: Math.floor(Math.random() * 300) + 50,
        name: `产品${String.fromCharCode(65 + i)}`
      }))
    },
    scatterChart: {
      categories: [
        { name: '男性', data: generateScatterData(50, 160, 55, 25) },
        { name: '女性', data: generateScatterData(50, 170, 65, 30) },
        { name: '青少年', data: generateScatterData(50, 180, 75, 35) },
        { name: '儿童', data: generateScatterData(50, 140, 35, 20) },
        { name: '老年人', data: generateScatterData(50, 165, 60, 28) },
        { name: '运动员', data: generateScatterData(50, 175, 70, 32) }
      ]
    },
    radarChart: {
      indicators: [
        { name: '性能', max: 100 },
        { name: '易用性', max: 100 },
        { name: '功能', max: 100 },
        { name: '设计', max: 100 },
        { name: '价格', max: 100 },
        { name: '服务', max: 100 },
        { name: '安全', max: 100 },
        { name: '速度', max: 100 },
        { name: '稳定性', max: 100 },
        { name: '兼容性', max: 100 }
      ],
      products: [
        { name: '产品A', data: generateRandomData(10, 60, 95) },
        { name: '产品B', data: generateRandomData(10, 60, 95) },
        { name: '产品C', data: generateRandomData(10, 60, 95) },
        { name: '产品D', data: generateRandomData(10, 60, 95) },
        { name: '产品E', data: generateRandomData(10, 60, 95) }
      ]
    },
    stackedBarChart: {
      months: ['1月', '2月', '3月', '4月', '5月', '6月'],
      categories: [
        { name: '类别A', data: [120, 132, 101, 134, 90, 230] },
        { name: '类别B', data: [220, 182, 191, 234, 290, 330] },
        { name: '类别C', data: [150, 232, 201, 154, 190, 280] },
        { name: '类别D', data: [100, 120, 110, 130, 140, 150] },
        { name: '类别E', data: [80, 90, 85, 95, 100, 110] }
      ]
    },
    horizontalBarChart: {
      products: ['产品A', '产品B', '产品C', '产品D', '产品E', '产品F'],
      salesData: [320, 302, 301, 334, 390, 330]
    }
  }
}

