import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { StyledButton, VisuallyHiddenInput } from 'styles/styles'
import {
  SaveAs as SaveIcon,
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material'
import { useConfirmModal } from 'hooks/useConfirmModal'
import useNotification from 'hooks/useNotification'
import useMyCompany, { MyCompanyDetail } from './hooks/useMyCompany'
import { isShrink } from 'utils/inputUtils'
import MarkInputPhoneNumber from 'components/MarkInput/MarkInputPhoneNumber'
import MarkInputPostalCode from 'components/MarkInput/MarkInputPostalCode'
import MarkInputCorporateNumber from 'components/MarkInput/MarkInputCorporateNumber'
import { deConvertPostalCode } from 'utils/formatUtils'

interface UploadedImage {
  file?: File
  previewUrl: string
}

export default function MyCompanyManagementPage() {
  const { notificationModal, notificationSnackbar } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  // const [formCompanyDetail, setFormCompanyDetail] = useState<Partial<MyCompanyDetail>>({})
  const {
    getMyCompanyDetail,
    formCompanyDetail,
    getPostCode,
    updateCompanyDetail,
    addNewMyCompanyDetail,
    setFormCompanyDetail,
    uploadedImage,
    setUploadedImage,
  } = useMyCompany()

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  useEffect(() => {
    getMyCompanyDetail()
  }, [])

  const handleClickGetPostCode = () => {
    // console.log(formCompanyDetail?.companyPostCode)
    getPostCode(deConvertPostalCode(formCompanyDetail?.postalCode ?? ''))
  }

  const handleSaveClick = async () => {
    const confirmed = await openConfirmModal({
      title: '確認してください',
      message: 'このデータを保存しますか。',
    })
    if (confirmed) {
      // Perform update operation
      if (formCompanyDetail.id) {
        updateCompanyDetail(formCompanyDetail as MyCompanyDetail, uploadedImage?.file)
      } else {
        addNewMyCompanyDetail(formCompanyDetail as MyCompanyDetail, uploadedImage?.file)
      }
    } else {
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    // console.log(name, value)
    setFormCompanyDetail(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        console.log(file.type)
        notificationSnackbar.error('file type is not impage file.')
        // setError(`File ${file.name} is not an allowed image type. Please select a JPEG, PNG, GIF, or WebP image.`);
        event.target.value = ''
        return
      }
      try {
        //if company id should auto update but at confirm is shuold be update

        // console.log('Upload successful', file)
        const newImage: UploadedImage = {
          file,
          previewUrl: URL.createObjectURL(file),
        }
        // console.log(newImage.previewUrl)
        setUploadedImage(newImage)
      } catch (error) {
        // setPreviewUrl(null)
        if (error instanceof Error) {
          console.log(error.message)
        } else {
          console.log('An unknown error occurred')
        }
      }
    }
    // Reset the file input
    event.target.value = ''
  }

  const taxList = [
    {
      value: 8,
      label: '8%',
    },
    {
      value: 10,
      label: '10%',
    },
  ]

  const clearFileUpload = () => {
    if (uploadedImage && uploadedImage.previewUrl) {
      URL.revokeObjectURL(uploadedImage.previewUrl)
    }
    setUploadedImage(null)
  }
  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage.previewUrl)
      }
    }
  }, [uploadedImage])

  return (
    <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Box p={2}>
        <Typography variant='h5' noWrap>
          <Divider textAlign='left'>企業情報</Divider>
        </Typography>
      </Box>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 12,
        }}
      >
        <Box display={'flex'} flexDirection='row' gap={2}>
          <TextField
            fullWidth
            name='name'
            label='企業名称'
            value={formCompanyDetail.name ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.name) }}
            // onChange={e => handleChange('companyName', e.target.value)}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name='phoneNumber'
            label='電話番号'
            value={formCompanyDetail.phoneNumber ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.phoneNumber) }}
            // onChange={e => handleChange('companyTelNumber', e.target.value)}
            onChange={handleChange}
            InputProps={{
              inputComponent: MarkInputPhoneNumber as any,
            }}
          />
          <TextField
            fullWidth
            name='email'
            label='メール'
            value={formCompanyDetail.email ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.email) }}
            type='email'
            // onChange={e => handleChange('mail', e.target.value)}
            onChange={handleChange}
          />
        </Box>
        <Box display={'flex'} flexDirection='row' gap={2}>
          <TextField
            fullWidth
            name='corporationNumber'
            label='法人番号'
            value={formCompanyDetail.corporationNumber ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.corporationNumber) }}
            // onChange={e => handleChange('corporateNumber', e.target.value)}
            onChange={handleChange}
            InputProps={{
              inputComponent: MarkInputCorporateNumber as any,
              inputProps: {
                maxLength: 12,
              },
            }}
          />
          <TextField
            fullWidth
            name='accountNumber'
            label='口座番号'
            value={formCompanyDetail.accountNumber ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.accountNumber) }}
            // onChange={e => handleChange('companyBankAccount', e.target.value)}
            onChange={handleChange}
          />
        </Box>
        <Box display={'flex'} flexDirection='row' gap={2} justifyContent='space-between'>
          <Box display={'flex'} sx={{ width: '30%' }}>
            <TextField
              id='outlined-select-currency-native'
              select
              label='Tax'
              fullWidth
              name='tax'
              value={formCompanyDetail.tax ?? ''}
              InputLabelProps={{
                component: 'span',
              }}
              onChange={handleChange}
            >
              {taxList.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box display={'flex'} gap={4}>
            {uploadedImage && (
              <img
                src={uploadedImage.previewUrl}
                alt='Preview'
                style={{ width: 120, height: 120 }}
              />
            )}
            <Box display={'flex'} flexDirection={'column'} alignItems='flex-start' mr={4} gap={4}>
              <Button
                component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload Seal
                <VisuallyHiddenInput
                  type='file'
                  onChange={handleFileChange}
                  accept={ALLOWED_TYPES.join(',')}
                />
              </Button>
              {uploadedImage && (
                <Button
                  component='label'
                  variant='outlined'
                  // tabIndex={-1}
                  onClick={clearFileUpload}
                  // startIcon={<CloudUploadIcon />}
                >
                  Remove
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        <Typography variant='h5' p={2}>
          住所
        </Typography>
        <Box display={'flex'} flexDirection='row' gap={2} alignItems='center'>
          <TextField
            // fullWidth
            name='postalCode'
            label='郵便番号'
            value={formCompanyDetail.postalCode ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.postalCode) }}
            // onChange={e => handleChange('postCode', e.target.value)}

            onChange={handleChange}
            InputProps={{
              inputComponent: MarkInputPostalCode as any,
            }}
          />
          <StyledButton
            variant='outlined'
            startIcon={<SearchIcon />}
            size='large'
            sx={{ height: 48 }}
            onClick={handleClickGetPostCode}
          >
            検索
          </StyledButton>
        </Box>
        <Box display={'flex'} gap={2}>
          <TextField
            fullWidth
            name='prefecture'
            label='首都府県'
            value={formCompanyDetail.prefecture ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.prefecture) }}
            // onChange={e => handleChange('prefecture',e.target.value)}
          />
          <TextField
            fullWidth
            name='city'
            label='市区町村'
            value={formCompanyDetail.city ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.city) }}
            // onChange={e => handleChange('city',e.target.value)}
          />
        </Box>
        <Box display={'flex'} gap={2}>
          <TextField
            fullWidth
            name='streetAddress'
            label='番地'
            value={formCompanyDetail.streetAddress ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.streetAddress) }}
            // onChange={e => handleChange('addressCode', e.target.value)}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name='buildingName'
            label='建物名・部屋番号'
            value={formCompanyDetail.buildingName ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail?.buildingName) }}
            // onChange={e => handleChange('buildName', e.target.value)}
            onChange={handleChange}
          />
        </Box>
        <Divider orientation='horizontal' sx={{ mt: 4 }} />
        <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
          <StyledButton
            variant='outlined'
            startIcon={<SaveIcon />}
            size='large'
            onClick={handleSaveClick}
          >
            保存する
          </StyledButton>
        </Box>
      </Container>
    </Box>
  )
}
