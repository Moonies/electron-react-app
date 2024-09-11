import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  table: {
    width: 540,
    borderStyle: 'solid',
    borderWidth: 1,
    // borderRightWidth: 0,
    // borderBottomWidth: 0,
    // borderLeftWidth: 0,
    // borderColor: 'red',
    height: 230,
  },
  tableRow: {
    // margin: 'auto',
    flexDirection: 'row',
    textAlign: 'left',
    // flex: 1,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 0.4,
  },
  tableCell: {
    margin: 'auto',
    fontSize: 10,
  },
  headerCell: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})
