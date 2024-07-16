import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { saveAs } from 'file-saver'
import { GridColDef } from '@mui/x-data-grid'

// Helper function to get cell value
const getCellValue = (row: any, col: GridColDef): string => {
  if (
    typeof row[col.field] === 'number' &&
    col.field !== 'orderId' &&
    col.field !== 'invoiceNumber'
  ) {
    return formatCurrency(row[col.field])
  }
  return row[col.field]?.toString() || ''
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value)
}

// Export to CSV
export const exportToCsv = (columns: GridColDef[], rows: any[]) => {
  const headers = columns.map(col => col.headerName || col.field)
  const data = rows.map(row => columns.map(col => getCellValue(row, col)))
  const csvContent = [headers, ...data].map(e => e.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'export.csv')
}

// Export to XLSX
export const exportToXlsx = (columns: GridColDef[], rows: any[]) => {
  const headers = columns.map(col => col.headerName || col.field)
  const data = rows.map(row => columns.map(col => getCellValue(row, col)))
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, 'export.xlsx')
}

// Helper function to safely add text to PDF
// const safeGetCellValue = (row: any, col: GridColDef): string => {
//   try {
//     if (col.valueGetter) {
//       return col.valueGetter(row)?.toString() || '';
//     }
//     if (col.valueFormatter) {
//       return col.valueFormatter({ value: row[col.field] })?.toString() || '';
//     }
//     return (row[col.field] ?? '').toString();
//   } catch (error) {
//     console.error(`Error getting cell value for field ${col.field}:`, error);
//     return '';
//   }
// };

// Updated exportToPdf function
export const exportToPdf = (columns: GridColDef[], rows: any[], title: string = '見積書') => {
  const doc = new jsPDF()

  try {
    // Set font
    doc.setFont('helvetica', 'normal')

    // Header
    doc.setFontSize(24)
    doc.text(title, 105, 20, { align: 'center' })

    doc.setFontSize(10)
    doc.text('Company Name', 14, 40)
    doc.text('Address Line 1', 14, 45)
    doc.text('Address Line 2', 14, 50)
    doc.text('Phone: xxx-xxx-xxxx', 14, 55)
    doc.text('Email: example@example.com', 14, 60)

    // Date
    const today = new Date()
    doc.text(`Date: ${today.toISOString().split('T')[0]}`, 14, 70)

    // Prepare table data
    const headers = columns.map(col => col.headerName || col.field)
    const data = rows.map(row => columns.map(col => getCellValue(row, col)))

    // Add table
    ;(doc as any).autoTable({
      head: [headers],
      body: data,
      startY: 80,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      didDrawPage: (data: any) => {
        doc.text(
          `Page ${data.pageNumber} of ${doc.getNumberOfPages()}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        )
      },
    })

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 200
    doc.text('Thank you for your business!', 14, finalY + 10)

    doc.save(`${title}.pdf`)
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    alert('PDF generation failed. Please try again or contact support.')
  }
}

// Print function
export const printData = (columns: GridColDef[], rows: any[], title: string = '見積書') => {
  const headers = columns.map(col => col.headerName || col.field)
  const data = rows.map(row => columns.map(col => getCellValue(row, col)))

  const total = data.reduce((sum, row) => sum + parseFloat(row[4] || '0'), 0)
  const tax = total * 0.1 // Assuming 10% tax rate

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Noto Sans JP', sans-serif; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-info { float: left; }
            .recipient-info { float: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 20px; }
            .totals { float: right; text-align: right; }
            @media print {
              .no-print { display: none; }
              @page { margin: 0.5in; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="company-info">
            <p>株式会社さんせん清水</p>
            <p>〒613-0915</p>
            <p>京都府京都市伏見区淀際目町335-5 123</p>
            <p>TEL: 012-3456-7899</p>
            <p>E-Mail: info@sansenshimizu.com</p>
          </div>
          <div class="recipient-info">
            <p>御中</p>
            <p>株式会社さんせん清水</p>
            <p>〒613-0915</p>
            <p>北海道市伏見区淀際目町335-9</p>
            <p>TEL: 012-3456-789</p>
            <p>FAX: 070-0315-1547</p>
          </div>
          <div style="clear: both;"></div>
          <p>発行日: ${new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
          <p>番号: 1</p>
          <table>
            <thead>
              <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map(row => `<tr>${row.map((cell: any) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
          <div class="footer">
            <div class="totals">
              <p>小計: ${formatCurrency(total)}</p>
              <p>消費税 (10%): ${formatCurrency(tax)}</p>
              <p>合計: ${formatCurrency(total + tax)}</p>
            </div>
            <p>備考</p>
            <p>*軽減税率対象品</p>
          </div>
          <div class="no-print">
            <button onclick="window.print()">Print</button>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }
}
