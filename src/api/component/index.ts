import { default as addNewComponent } from './addNewComponent'
import { default as getComponentList } from './getComponentList'
import { default as getComponentData } from './getComponentData'
import { default as getTotalAmountComponent } from './getTotalAmountComponent'
import { default as getComponentDetail } from './getComponentPurchaseHistory'
import { default as updateComponents } from './updateComponents'

export default function component() {
  return {
    getComponentList,
    getComponentData,
    getTotalAmountComponent,
    getComponentDetail,
    addNewComponent,
    updateComponents,
  }
}
