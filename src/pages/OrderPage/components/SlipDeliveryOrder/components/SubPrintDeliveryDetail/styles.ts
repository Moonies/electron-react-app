import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  table: {
    // display: 'table',
    width: 540,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 216,
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
