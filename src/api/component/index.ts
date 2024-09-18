import { default as getComponentList } from './getComponentList'
import { default as getComponentData } from './getComponentData'
import { default as getTotalAmountComponent } from './getTotalAmountComponent'
export default function component() {
  return { getComponentList, getComponentData, getTotalAmountComponent }
}
