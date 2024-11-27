import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Close as CloseIcon } from '@mui/icons-material'
import SlideTransition from 'components/Transition/Slide'
import { useState } from 'react'

interface imagePreviewProps {
  open: boolean
  productDetail: { name: string; number: string }
  imagePreview: string
  onClose: () => void
}

export default function ImageViewerModal({
  imagePreview,
  onClose,
  open,
  productDetail,
}: imagePreviewProps) {
  const { Slide } = SlideTransition({ direction: 'up' })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    setDimensions({
      width: img.offsetWidth,
      height: img.offsetHeight,
    })
    // setIsLoading(false);
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown
      fullWidth
      // fullScreen
      maxWidth={'lg'}
      keepMounted
      scroll={'paper'}
      // sx={{ ...dimensions }}
      TransitionComponent={Slide}
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>
            {productDetail.number}-{productDetail.number} of Image
          </Typography>
          <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} justifyContent='center'>
          <img src={imagePreview} alt='Preview' onLoad={handleImageLoad} height={480} />
        </Box>
      </DialogContent>
    </Dialog>
  )
}
