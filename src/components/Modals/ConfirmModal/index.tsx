import React, { useState, useCallback, createContext, ReactNode } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'

interface ConfirmModalOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

interface ConfirmModalContextType {
  openConfirmModal: (options: ConfirmModalOptions) => Promise<boolean>
}

export const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(undefined)

interface ConfirmModalProviderProps {
  children: ReactNode
}

export const ConfirmModalProvider: React.FC<ConfirmModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<ConfirmModalOptions & { isOpen: boolean }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'はい',
    cancelText: 'いいえ',
  })
  const [resolveCallback, setResolveCallback] = useState<((value: boolean) => void) | null>(null)

  const openConfirmModal = useCallback((options: ConfirmModalOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setModalState({
        isOpen: true,
        ...options,
        confirmText: options.confirmText || 'はい',
        cancelText: options.cancelText || 'いいえ',
      })
      setResolveCallback(() => resolve)
    })
  }, [])

  const handleConfirm = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
    if (resolveCallback) resolveCallback(true)
  }, [resolveCallback])

  const handleCancel = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }))
    if (resolveCallback) resolveCallback(false)
  }, [resolveCallback])

  const contextValue = { openConfirmModal }

  return (
    <ConfirmModalContext.Provider value={contextValue}>
      {children}
      <Dialog
        open={modalState.isOpen}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCancel()
          }
        }}
        aria-labelledby='confirm-dialog-title'
        aria-describedby='confirm-dialog-description'
      >
        <DialogTitle
          sx={theme => ({
            backgroundColor: theme.palette.warning.dark,
          })}
        >
          {modalState.title}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: 'pre-line' }}>{modalState.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant='contained' aria-label='close'>
            {modalState.cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            color='primary'
            variant='outlined'
            sx={{ color: 'white' }}
            aria-label='close'
          >
            {modalState.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmModalContext.Provider>
  )
}
