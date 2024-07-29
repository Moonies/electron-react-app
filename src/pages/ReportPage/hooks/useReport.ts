import React from 'react'

export default function useReport() {
  const saleChartData = [
    { label: '2023/1', totalSale: 7191135, totalOrder: 0, totalPreSale: 0, totalTarget: 2666666 },
    { label: '2023/2', totalSale: 4991116, totalOrder: 0, totalPreSale: 0, totalTarget: 2666666 },
    { label: '2023/3', totalSale: 395531, totalOrder: 0, totalPreSale: 0, totalTarget: 2666666 },
    { label: '2023/4', totalSale: 6077421, totalOrder: 0, totalPreSale: 0, totalTarget: 2666666 },
    { label: '2023/5', totalSale: 7134497, totalOrder: 0, totalPreSale: 0, totalTarget: 2666666 },
  ]
  const profitChartData = [
    { label: '2023/1', totalUnit: 69170, totalProfit: 3595781 },
    { label: '2023/2', totalUnit: 49683, totalProfit: 2495526 },
    { label: '2023/3', totalUnit: 43967, totalProfit: 1977547 },
    { label: '2023/4', totalUnit: 1000, totalProfit: 4729200 },
  ]
  const bestTopFiveProductList = [
    {
      productCode: 'F006',
      productName: 'Bread - Bagels Mini',
      totalProfit: 3076834,
      profitPercent: 20.087,
    },
    {
      productCode: 'C003',
      productName: 'Appetizer - Soutwestern',
      totalProfit: 2932209,
      profitPercent: 19.143,
    },
    { productCode: 'H008', productName: 'Absolut', totalProfit: 2281535, profitPercent: 14.895 },
    {
      productCode: 'B002',
      productName: 'example 001',
      totalProfit: 1852830,
      profitPercent: 12.096,
    },
    {
      productCode: 'J010',
      productName: 'example 002',
      totalProfit: 1713865,
      profitPercent: 11.189,
    },
  ]
  const worstTopFiveProductList = [
    {
      productCode: 'abc123',
      productName: 'abc',
      quantityPercent: 0.004,
      profitPercent: 0.002,
    },
    {
      productCode: 'M2',
      productName: 'Meepo all Mid bobo',
      quantityPercent: 0.004,
      profitPercent: 0.009,
    },
    {
      productCode: 'TG-UB15-30-DN',
      productName: 'Absolut',
      quantityPercent: 0.004,
      profitPercent: 0.025,
    },
    {
      productCode: 'NB-VM10006-BU',
      productName: 'VM TUMBLER (BLUE)',
      quantityPercent: 0.008,
      profitPercent: 0.039,
    },
    {
      productCode: 'NB-VM1006-RD',
      productName: 'VM TUMBLER (RED)',
      quantityPercent: 0.008,
      profitPercent: 0.039,
    },
  ]
  return { saleChartData, profitChartData, bestTopFiveProductList, worstTopFiveProductList }
}
