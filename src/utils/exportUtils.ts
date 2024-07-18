import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { saveAs } from 'file-saver'
import { GridColDef } from '@mui/x-data-grid'
import JsBarcode from 'jsbarcode'
import '../asset/fonts/NotoSansJP-normal'

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

const drawVerticalText = (doc: jsPDF, text: string, x: number, y: number, fontSize: number) => {
  const characters = text.split('')
  doc.setFontSize(fontSize)
  const lineHeight = fontSize * 0.5 // Reduce this value for tighter spacing
  characters.forEach((char, index) => {
    doc.text(char, x, y + index * lineHeight)
  })
}

const drawAlignedPair = (
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number
) => {
  doc.text(label, x, y, { align: 'left' })
  doc.text(value, x + width, y, { align: 'right' })
}

const addBarcode = (
  doc: jsPDF,
  value: string,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const canvas = document.createElement('canvas')
  const scale = 512 // Increase this for higher resolution
  canvas.width = (width * scale) / 240
  canvas.height = (height * scale) / 240

  JsBarcode(canvas, value, {
    format: 'CODE128',
    width: 1,
    // height: height * scale,
    displayValue: false,
    background: 'transparent',
  })
  const imgData = canvas.toDataURL('image/png', 1.0)
  doc.addImage(imgData, 'PNG', x, y, width, height)
}

const drawLabelValuePair = (
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  maxWidth: number
) => {
  const labelWidth = doc.getTextWidth(label)
  const valueWidth = doc.getTextWidth(value)
  const spacing = 2

  doc.text(label, x, y)
  // Calculate center position for value
  const remainingWidth = maxWidth - labelWidth - spacing
  const valueX = x + labelWidth + spacing + remainingWidth / 2 - valueWidth / 2

  // Draw value
  doc.text(value, valueX, y)
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
    const pageHeight = doc.internal.pageSize.height
    const pageWidth = doc.internal.pageSize.width
    const pageMiddle = pageWidth / 2
    const margin = 14
    const marginMidle = 28
    const footerHeight = 30
    const usableWidth = pageWidth - 2 * margin
    const today = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    const labelTelWidth = doc.getTextWidth('TEL :')
    const labelEmailWidth = doc.getTextWidth('E-Mail:')
    const labelFaxWidth = doc.getTextWidth('Fax :')

    // Header
    const header = (data: any) => {
      doc.setFontSize(24)
      doc.text(title, pageWidth / 2, 20, { align: 'center', charSpace: 8 })

      //Recipient info
      doc.setFontSize(18)
      const customerName = '株式会社さんせん清水'
      doc.text('株式会社さんせん清水', margin + 5, 40, { maxWidth: 75 })
      drawVerticalText(doc, '御中', 95, 37, 14) // Draw '御中' vertically
      doc.setDrawColor(0)
      doc.setLineWidth(0.5)
      doc.line(margin, 45, 90, 45)

      doc.setFontSize(10)
      doc.text('〒000-0000', margin, 60)
      doc.text('京都府京都市伏見区淀際目町335-5 123', margin, 67)

      doc.text('TEL:', margin, 74)
      doc.text('012-3456-7899', margin + labelTelWidth + 5, 74)
      doc.text('E-Mail:', margin, 81)
      doc.text('customer@xxxxxxxx.com', margin + labelEmailWidth + 5, 81)

      doc.text('下記の通り、納品致しました。', margin, 95),
        drawLabelValuePair(doc, '発行日 ', today, pageWidth - 80, 40, 70)
      // Draw '番号' and its value
      drawLabelValuePair(doc, '番号  ', '1234567890', pageWidth - 80, 47, 70)

      // Add barcode
      addBarcode(doc, '1234567890', pageWidth - 65, 50, 50, 10)

      // Sender info
      doc.text('株式会社さんせん清水', pageMiddle + marginMidle, 65, { align: 'left' })
      doc.text('〒613-0915', pageMiddle + marginMidle, 72, { align: 'left' })
      doc.text('北海道市伏見区淀際目町335-9', pageMiddle + marginMidle, 79, {
        align: 'left',
      })
      doc.text('E-Mail:', pageMiddle + marginMidle, 86, { align: 'left' })
      doc.text('info@sansenshimizu.com', pageMiddle + marginMidle + labelEmailWidth + 5, 86, {
        align: 'left',
      })
      doc.text('TEL:', pageMiddle + marginMidle, 93, { align: 'left' })
      doc.text('012-3456-789', pageMiddle + marginMidle + labelTelWidth + 5, 93, { align: 'left' })
      doc.text('FAX:', pageMiddle + marginMidle, 100, { align: 'left' })
      doc.text('070-0315-1547', pageMiddle + marginMidle + labelFaxWidth + 5, 100, {
        align: 'left',
      })
    }

    // Footer
    const footer = (data: any) => {
      const pageCount = (doc as any).internal.pages.length - 1 // Fix for TypeScript error
      doc.setFontSize(10)
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - footerHeight + 10,
        {
          align: 'right',
        }
      )
      doc.text('備考', margin, pageHeight - footerHeight + 5)
      doc.text('*軽減税率対象品', margin, pageHeight - footerHeight + 10)

      // Add black line
      doc.setDrawColor(0)
      doc.setLineWidth(0.5)
      doc.line(
        margin,
        pageHeight - footerHeight + 15,
        pageWidth - margin,
        pageHeight - footerHeight + 15
      )
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
      startY: 110,
      theme: 'grid',
      styles: { font: 'NotoSansJP', fontSize: 8 },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.1, // Add border width
        lineColor: [0, 0, 0], // Black border color
        fontSize: 12,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
      },
      margin: { top: 110, bottom: footerHeight + 25 },
      didDrawPage: (data: any) => {
        header(data)
        footer(data)
      },
      didParseCell: function (data: any) {
        if (data.section === 'body') {
          if (isNumber(data.cell.raw)) {
            data.cell.styles.halign = 'right' // Right-align numeric values
          } else {
            data.cell.styles.halign = 'left' // Left-align non-numeric values
          }
        }
      },
      willDrawCell: (data: any) => {
        // Check if we're close to the footer
        if (data.row.y + data.row.height > pageHeight - footerHeight - 10) {
          doc.addPage()
          header(data)
          footer(data)
          data.cursor.y = 100 // Reset Y position after adding new page
        }
      },
    })

    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY + 10 || 100
    doc.setFontSize(12)
    doc.setDrawColor(0)
    doc.setLineWidth(0.5)
    const totalSectionWidth = 90
    const totalSectionX = pageWidth - margin - totalSectionWidth

    drawAlignedPair(
      doc,
      '小計：',
      formatCurrency(total),
      totalSectionX,
      finalY + 10,
      totalSectionWidth
    )
    drawAlignedPair(
      doc,
      '消費税 (10%):',
      formatCurrency(tax),
      totalSectionX,
      finalY + 20,
      totalSectionWidth
    )

    doc.line(totalSectionX, finalY + 23, totalSectionX + totalSectionWidth, finalY + 22)
    drawAlignedPair(
      doc,
      '合計：',
      formatCurrency(total + tax),
      totalSectionX,
      finalY + 33,
      totalSectionWidth
    )
    doc.line(totalSectionX, finalY + 35, totalSectionX + totalSectionWidth, finalY + 35)
    doc.line(totalSectionX, finalY + 36, totalSectionX + totalSectionWidth, finalY + 36)

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

// Print function optional (building con..)
/* export const printData = (columns: GridColDef[], rows: any[], title: string = '見積書') => {
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
} */
