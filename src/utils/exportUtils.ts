import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { saveAs } from 'file-saver'
import { GridColDef } from '@mui/x-data-grid'
// import '../asset/fonts/NotoSansJP-normal'

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

const sumCellValue = (row: any[]): number => {
  let total = row.reduce((accumulator, current) => accumulator + current.totalPrice, 0)
  return total
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value)
}

const reverseNumberFormat = (stringNumber: string) => {
  const currencyRegex = /^[^\d]*(\d{1,3}(,\d{3})*(\.\d{2})?)$/

  if (!currencyRegex.test(stringNumber)) {
    // If it's not a valid currency string, return the original input
    return stringNumber
  }

  // Remove currency symbols and commas
  const numericString = stringNumber.replace(/[^\d.]/g, '')

  // Convert to number
  return parseFloat(numericString)
}

const isNumber = (value: string): boolean => {
  let currentNumber = reverseNumberFormat(value)
  return typeof currentNumber === 'number' ? true : false
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
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16, // or "smart", 2-16, or 'smart'
  })

  try {
    // Add Japanese font support
    doc.setFont('NotoSansJP', 'normal')

    // Header
    const header = (data: any) => {
      doc.setFontSize(24)
      doc.text(title, doc.internal.pageSize.width / 2, 20, { align: 'center' })

      doc.setFontSize(10)
      doc.text('株式会社さんせん清水', 14, 40)
      doc.text('〒613-0915', 14, 45)
      doc.text('京都府京都市伏見区淀際目町335-5 123', 14, 50)
      doc.text('TEL：012-3456-7899', 14, 55)
      doc.text('E-Mail：info@sansenshimizu.com', 14, 60)

      const today = new Date()
      doc.text(
        `発行日：${today.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}`,
        doc.internal.pageSize.width - 14,
        40,
        { align: 'right' }
      )
      doc.text('番号：*1*', doc.internal.pageSize.width - 14, 45, { align: 'right' })

      // Recipient info
      doc.text('御中', doc.internal.pageSize.width - 14, 60, { align: 'right' })
      doc.text('株式会社さんせん清水', doc.internal.pageSize.width - 14, 65, { align: 'right' })
      doc.text('〒613-0915', doc.internal.pageSize.width - 14, 70, { align: 'right' })
      doc.text('北海道市伏見区淀際目町335-9', doc.internal.pageSize.width - 14, 75, {
        align: 'right',
      })
      doc.text('TEL:012-3456-789', doc.internal.pageSize.width - 14, 80, { align: 'right' })
      doc.text('FAX:070-0315-1547', doc.internal.pageSize.width - 14, 85, { align: 'right' })
    }

    // Footer
    const footer = (data: any) => {
      const pageCount = (doc as any).internal.pages.length - 1 // Fix for TypeScript error
      doc.setFontSize(10)
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
      doc.text('備考', 14, doc.internal.pageSize.height - 25)
      doc.text('*軽減税率対象品', 14, doc.internal.pageSize.height - 20)
    }

    // Prepare table data
    const headers = columns.map(col => col.headerName || col.field)
    const data = rows.map(row => columns.map(col => getCellValue(row, col)))

    // Calculate totals
    const total = sumCellValue(rows)
    const tax = total * 0.1
    // Assuming 10% tax rate

    // Add table
    ;(doc as any).autoTable({
      head: [headers],
      body: data,
      startY: 100,
      theme: 'grid',
      styles: { font: 'NotoSansJP', fontSize: 8 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      margin: { top: 100 },
      didDrawPage: (data: any) => {
        header(data)
        footer(data)
      },
    })

    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY || 100
    doc.setFontSize(10)
    doc.text(`小計：${formatCurrency(total)}`, doc.internal.pageSize.width - 14, finalY + 10, {
      align: 'right',
    })
    doc.text(
      `消費税 (10%)：${formatCurrency(tax)}`,
      doc.internal.pageSize.width - 14,
      finalY + 15,
      { align: 'right' }
    )
    doc.text(
      `合計：${formatCurrency(total + tax)}`,
      doc.internal.pageSize.width - 14,
      finalY + 20,
      { align: 'right' }
    )

    // Save the PDF
    doc.save(`${title}.pdf`)

    // Optional: Preview after export
    // This part is commented out because it requires additional setup and might not work in all environments
    // const pdfDataUri = doc.output('datauristring')
    // const newWindow = window.open()
    // newWindow?.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`)
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    alert('PDF generation failed. Please try again or contact support.')
  }
}

// Print function
export const printData = (columns: GridColDef[], rows: any[], title: string = '見積書') => {
  const headers = columns.map(col => col.headerName || col.field)
  const data = rows.map(row => columns.map(col => getCellValue(row, col)))

  const total = sumCellValue(rows)
  const tax = total * 0.1 // Assuming 10% tax rate
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Noto Sans JP', sans-serif;background-color: #525252; }
            .company-info { float: left; }
            .recipient-info { float: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header, .header-space,
            .footer, .footer-space {
              height: 100px;
            }
            .content {
              margin-bottom:100px;
            }
            .header { text-align: center; }
            .footer { margin-top: 20px; }
            .totals { float: right; text-align: right; }
            .page {
                width: 210mm;
                min-height: 297mm;
                padding: 10mm 20mm;
                margin: 0mm auto;
                background: white;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
                counter-reset: page;
              }
              .no-print { display: none; }
              .page {
                  margin: 0;
                  padding: 0;
                  border: initial;
                  border-radius: initial;
                  width: initial;
                  min-height: initial;
                  box-shadow: initial;
                  background: initial;
                  page-break-after: always;
              }
              .page::after {
                counter-increment: page;
                content: counter(page);
                position: absolute;
                bottom: 5mm;
                right: 5mm;
              }
              .print-footer {
                position: fixed;
                bottom: 0;
                height: 100px;
              }
              .content{
                padding-bottom:250px;
              }

              table { page-break-inside:auto}
              tr    { 
                page-break-inside:avoid; 
                page-break-after:auto 
              }
              thead { display:table-header-group; }
              tfoot { display:table-footer-group; }
            }
            
          </style>
        </head>
        <body>
          <div class="page">
            <div class="headerContainer">
              <div class="header">
                <h1>${title}</h1>
              </div>
              <div style="display: flex;flex-direction: column;align-items: flex-end;">
                <p>発行日: ${new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                <p>番号: </p>
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
            </div>
            <div class="content">
              <table>
                <thead>
                  <tr>${headers.map(header => `<th style="text-align:center;">${header}</th>`).join('')}</tr>
                </thead>
                <tbody>
                  ${data.map(row => `<tr>${row.map((cell: any) => (isNumber(cell) ? `<td style="text-align:right;">${cell}</td>` : `<td style="text-align:left;">${cell}</td>`)).join('')}</tr>`).join('')}
                </tbody>
              </table>
              <div>
                <div class="totals">
                  <p>小計: ${formatCurrency(total)}</p>
                  <p>消費税 (10%): ${formatCurrency(tax)}</p>
                  <p>合計: ${formatCurrency(total + tax)}</p>
                </div>
                
              </div>
            </div>
            <div class="footerContainer print-footer">
              <div class="footer">
                <p>備考</p>
                <p>*軽減税率対象品</p>
              </div>

            </div>
            <div class="no-print" style="position: fixed;bottom: 50;right: 50;">
              <button onclick="window.print()" style="width: 150;">Print</button>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }
}
