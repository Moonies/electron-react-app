//wait for discuss, use on server(API) is good condition
// import nodemailer from 'nodemailer';
import useLoadingRedux from 'hooks/useLoading'
import { exportToPdf } from 'utils/exportUtils'
import { GridColDef } from '@mui/x-data-grid'
import { jsPDF } from 'jspdf'

interface Attachment {
  filename: string
  content: Buffer | string
  contentType?: string
}

interface EmailContent {
  to: string
  subject: string
  text?: string
  html?: string
  attachments?: Attachment[]
}

interface EmailTemplate {
  recipientCompany: string
  senderCompany: string
  senderName: string
  documentType: string
  dueDate: string
}

const createEmailText = (template: EmailTemplate) =>
  `
fpt japan holdings
ご担当者様
いつもお世話になっております。

${template.senderCompany}
${template.senderName}です。

売れ行きが好調なため、在庫が底をついてしまいそうです
つきましては、以下の条件にて、
至急お見積書のPDFファイルをご送付いただけないでしょうか。
■お見積内容
・納期：${template.dueDate}

お見積書をお送りいただきますようお願いいたします。
なお、時間を要する場合は、お知らせいただけますと幸いです。
お忙しいところ恐縮ですが、何卒よろしくお願い申し上げます。
`.trim()

export const useEmail = () => {
  const { withLoading } = useLoadingRedux()

  // Static email configuration
  const emailConfig = {
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your-email@example.com',
      pass: 'your-password',
    },
  }

  const sendEmail = async (content: EmailContent) => {
    // const result = await withLoading(
    //   new Promise((resolve, reject) => {
    //         const transporter = nodemailer.createTransport(emailConfig);
    //         transporter.sendMail(
    //           {
    //             from: emailConfig.auth.user,
    //             ...content,
    //             attachments: content.attachments,
    //           },
    //           (err, info) => {
    //             if (err) {
    //               reject({ code: 500, message: err.message });
    //             } else {
    //               resolve({ code: 200, message: 'Email sent successfully', data: info });
    //             }
    //           }
    //         );
    //       })
    // )
    // return withLoading(
    //   new Promise((resolve, reject) => {
    //     const transporter = nodemailer.createTransport(emailConfig);
    //     transporter.sendMail(
    //       {
    //         from: emailConfig.auth.user,
    //         ...content,
    //         attachments: content.attachments,
    //       },
    //       (err, info) => {
    //         if (err) {
    //           reject({ code: 500, message: err.message });
    //         } else {
    //           resolve({ code: 200, message: 'Email sent successfully', data: info });
    //         }
    //       }
    //     );
    //   })
    // );
  }

  const createAttachment = (file: File): Promise<Attachment> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve({
          filename: file.name,
          content: reader.result as string,
          contentType: file.type,
        })
      }
      reader.onerror = error => reject(error)
      reader.readAsDataURL(file)
    })
  }

  const createPdfAttachment = async (
    columns: GridColDef[],
    rows: any[],
    title: string = '見積書'
  ): Promise<Attachment> => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
          putOnlyUsedFonts: true,
          floatPrecision: 16,
        })

        exportToPdf(columns, rows, title)

        const pdfData = doc.output('arraybuffer')
        resolve({
          filename: `${title}.pdf`,
          content: Buffer.from(pdfData),
          contentType: 'application/pdf',
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  const sendEmailWithAttachments = async (
    emailContent: Omit<EmailContent, 'attachments' | 'text'>,
    template: EmailTemplate,
    files: File[],
    pdfData?: { columns: GridColDef[]; rows: any[]; title?: string }
  ) => {
    const attachments: Attachment[] = []

    // Process file attachments
    for (const file of files) {
      const attachment = await createAttachment(file)
      attachments.push(attachment)
    }

    // Generate PDF if pdfData is provided
    if (pdfData) {
      const pdfAttachment = await createPdfAttachment(pdfData.columns, pdfData.rows, pdfData.title)
      attachments.push(pdfAttachment)
    }

    // Send email with attachments and generated text
    return sendEmail({
      ...emailContent,
      text: createEmailText(template),
      attachments,
    })
  }

  return { sendEmail, sendEmailWithAttachments, createAttachment, createPdfAttachment }
}
