import { Typography, Button } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useLocation } from 'react-router-dom'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const location = useLocation()
  return (
    <Box
      role='alert'
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      justifyItems={'center'}
      // alignItems={'center'}
      marginX={48}
      marginY={36}
      padding={4}
      flex={1}
      style={{ border: '1px solid red', borderRadius: '5px' }}
      gap={4}
    >
      <Typography variant='h2' color={'error'}>
        Something went wrong in {location.pathname}
      </Typography>
      <Typography variant='h5'>{error.message}</Typography>
      <Typography variant='body1'>
        ***サポートまたは技術者に連絡してください。よければこのページをキャプチャしてください***
      </Typography>
      <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} marginTop={4}>
        <Button
          onClick={resetErrorBoundary}
          size={'large'}
          variant={'contained'}
          sx={{ width: '50%' }}
          color={'error'}
        >
          Try again
        </Button>
      </Box>
    </Box>
  )
}

export default ErrorFallback
