import { Divider, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { SaveAs as SaveIcon, Search as SearchIcon } from '@mui/icons-material'
import { StyledButton } from 'styles/styles'
import useApiConfig, { ApiConfig } from 'hooks/useApiConfig'
import { useEffect, useState } from 'react'
import { isShrink } from 'utils/inputUtils'
import { useConfirmModal } from 'hooks/useConfirmModal'

export default function IpConfigManegementPage() {
  const { loadConfig, updateConfig, config } = useApiConfig()
  const [ipConfig, setIpConfig] = useState(config)
  const { openConfirmModal } = useConfirmModal()

  const handleSaveClick = async () => {
    let newApiConfig = { baseUrl: ipConfig?.baseUrl ?? '', apiKey: ipConfig?.apiKey }
    updateConfig(newApiConfig)
    const confirmed = await openConfirmModal({
      title: '確認してください',
      message:
        'このプログラムを安全かつ継続的に使用できるように IP を変更する場合は、再起動する必要があります。\n今すぐ再起動しますか?',
    })
    if (confirmed) {
      window.location.reload()
    }
  }

  useEffect(() => {
    loadConfig
  }, [config])

  return (
    <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Box p={2}>
        <Typography variant='h5' noWrap>
          <Divider textAlign='left'>サーバ情報</Divider>
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
            name='baseUrl'
            label='Base IP Address'
            value={ipConfig?.baseUrl ?? ''}
            InputLabelProps={{ shrink: isShrink(ipConfig?.baseUrl) }}
            // onChange={e => handleChange('baseUrl', e.target.value)}

            onChange={e => setIpConfig({ baseUrl: e.target.value })}
          />
          <TextField
            fullWidth
            name='companyPhoneNumber'
            label='API Key'
            sx={{ visibility: 'hidden' }}
            value={ipConfig?.apiKey ?? ''}
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
