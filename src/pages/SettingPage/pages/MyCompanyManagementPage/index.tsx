import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { StyledButton } from 'styles/styles'
import { SaveAs as SaveIcon, Search as SearchIcon } from '@mui/icons-material'
import { useConfirmModal } from 'hooks/useConfirmModal'
import useNotification from 'hooks/useNotification'
import useMyCompany from './hooks/useMyCompany'
import { MyCompanyDetail } from 'api/myCompany/getMyCompanyDetail'
import { isShrink } from 'utils/inputUtils'
import MarkInputPhoneNumber from 'components/MarkInput/MarkInputPhoneNumber'
import MarkInputPostalCode from 'components/MarkInput/MarkInputPostalCode'
import MarkInputCorporateNumber from 'components/MarkInput/MarkInputCorporateNumber'

export default function MyCompanyManagementPage() {
  const { notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const [formCompanyDetail, setFormCompanyDetail] = useState<Partial<MyCompanyDetail>>({})
  const { getMyCompanyDetail, myCompanyDetail, getPostCode } = useMyCompany()

  useEffect(() => {
    getMyCompanyDetail()
  }, [])

  useEffect(() => {
    setFormCompanyDetail({ ...myCompanyDetail })
  }, [myCompanyDetail])

  const handleClickGetPostCode = () => {
    // console.log(formCompanyDetail?.companyPostCode)
    getPostCode(formCompanyDetail?.postalCode ?? '')
  }

  const handleSaveClick = async () => {
    // Implement add/edit functionality
    // console.log('Confirmed data:', formCompanyDetail)
    const confirmed = await openConfirmModal({
      title: '確認してください',
      message: 'Are you sure you want to save data.',
    })
    if (confirmed) {
      // Perform update operation
      console.log('Add confirmed')
    } else {
      console.log('Add cancelled')
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormCompanyDetail(prev => ({ ...prev, [name]: value }))
  }

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
            name='companyName'
            label='企業名称'
            value={formCompanyDetail.name ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.name) }}
            // onChange={e => handleChange('companyName', e.target.value)}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name='companyPhoneNumber'
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
            name='companyEmail'
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
            name='corporateNumber'
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
            name='companyBankAccount'
            label='口座番号'
            value={formCompanyDetail.accountNumber ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.accountNumber) }}
            // onChange={e => handleChange('companyBankAccount', e.target.value)}
            onChange={handleChange}
          />
        </Box>
        <Typography variant='h5' p={2}>
          住所
        </Typography>
        <Box display={'flex'} flexDirection='row' gap={2} alignItems='center'>
          <TextField
            // fullWidth
            name='companyPostCode'
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
            name='companyPerfecture'
            label='首都府県'
            value={formCompanyDetail.prefecture ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.prefecture) }}
            // onChange={e => handleChange('prefecture',e.target.value)}
          />
          <TextField
            fullWidth
            name='companyCity'
            label='市区町村'
            value={formCompanyDetail.city ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.city) }}
            // onChange={e => handleChange('city',e.target.value)}
          />
        </Box>
        <Box display={'flex'} gap={2}>
          <TextField
            fullWidth
            name='companyAddressCode'
            label='番地'
            value={formCompanyDetail.streetAddress ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail.streetAddress) }}
            // onChange={e => handleChange('addressCode', e.target.value)}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name='companyBuildingDetail'
            label='建物名・部屋番号'
            value={formCompanyDetail.bildingName ?? ''}
            InputLabelProps={{ shrink: isShrink(formCompanyDetail?.bildingName) }}
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
