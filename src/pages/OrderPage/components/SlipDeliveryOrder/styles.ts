import { StyleSheet, Font } from '@react-pdf/renderer'
import MyFonts from 'asset/fonts/NotoSansJP-Regular.ttf'

Font.register({
  format: 'truetype',
  family: 'Noto Sans JP',
  style: 'normal',
  weight: 400,
  //now current fonts src
  // src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf',
  src: MyFonts,
})
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingHorizontal: 28,
    fontFamily: 'Noto Sans JP',
  },
})

export { styles }
