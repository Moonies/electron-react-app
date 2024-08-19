import { default as getComponentList } from './getComponentList'
import { default as getComponentIdList } from './getComponentIdList'

export default function component() {
  return { getComponentList, getComponentIdList }
}
