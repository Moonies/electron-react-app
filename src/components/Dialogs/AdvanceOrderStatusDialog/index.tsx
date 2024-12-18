import { Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { Box } from '@mui/system'
import { OrderStatus, OrderType } from 'api/order'
import React from 'react'
import { PurchaseStatus } from 'api/purchase'
import { SaleStatus } from 'api/sale'
import { useConfirmModal } from 'hooks/useConfirmModal'

interface DialogAdvanceStatus {
  open: boolean
  onClose: () => void
  onSubmit: (advanceStatus: PurchaseStatus | SaleStatus) => void
  initialData: {
    id: string
    orderNumber: string
    status: OrderStatus | string
    orderType: OrderType
  }
}

export default function AdvanceOrderStatusDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}: DialogAdvanceStatus) {
  // const [advanceStatus, setAdvanceStatus] = useState<'Next' | 'Cancel'>('Next')
  const { openConfirmModal } = useConfirmModal()

  const onCancelButton = async (e: React.FormEvent) => {
    //status is cancle
    e.preventDefault()
    e.stopPropagation()
    const confirmed = await openConfirmModal({
      title: 'ご注意ください',
      message: '「はい」をクリックすると状態が変更、キャンセルされます。',
    })
    if (confirmed) {
      onSubmit(initialData.orderType === OrderType.SALE ? SaleStatus.CANCEL : PurchaseStatus.CANCEL)
    }
  }

  const onUpdateButton = () => {
    //next status update(Pending -> Confirm -> Complete)
    switch (initialData.status) {
      case OrderStatus.PENDING:
        //next step is CONFIRM
        onSubmit(
          initialData.orderType === OrderType.SALE ? SaleStatus.CONFIRM : PurchaseStatus.CONFIRM
        )
        break
      case OrderStatus.CONFIRM:
        //next step is COMPLETE
        onSubmit(
          initialData.orderType === OrderType.SALE ? SaleStatus.DELIVERED : PurchaseStatus.INSTOCK
        )
        break

      default:
        onSubmit(
          initialData.orderType === OrderType.SALE ? SaleStatus.PENDING : PurchaseStatus.PENDING
        )
        break
    }
  }

  const convertNextStatus = (currentStatus: OrderStatus | string) => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        //next step is CONFIRM
        return initialData.orderType === OrderType.SALE ? '受注' : '発注'

      case OrderStatus.CONFIRM:
        //next step is COMPLETE
        return initialData.orderType === OrderType.SALE ? '売上' : '入庫'

      default:
        return initialData.orderType === OrderType.SALE ? '見積' : '未発注'
    }
  }
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown={true}
      maxWidth='xs'
      fullWidth
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'> 受注番号　:　{initialData.orderNumber}</Typography>
          <Box display={'flex'} gap={4}>
            <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} justifyContent={'space-between'} gap={2}>
          <Button onClick={onCancelButton} variant='contained' size='large'>
            受注をキャンセル
          </Button>
          <Button
            onClick={onUpdateButton}
            color='primary'
            variant='outlined'
            sx={{ color: 'white' }}
            size='large'
          >
            状態変更　（次は{convertNextStatus(initialData.status)}）
          </Button>
        </Box>
        <Typography variant='caption' gutterBottom>
          ***クリックする前に現在の状態を確認してください***
        </Typography>
      </DialogContent>
    </Dialog>
  )
}
