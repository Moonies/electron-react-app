import { default as addNewComponent, AddNewComponentProps } from './addNewComponent'
import { default as getComponentData, ComponentData as componentDetail } from './getComponentData'
import {
  default as getComponentPurchaseHistory,
  PurchaseOrderHistory,
} from './getComponentPurchaseHistory'
import {
  default as getComponentList,
  SearchCriteriaComponentList,
  ComponentData,
} from './getComponentList'
import { default as getTotalAmountComponent } from './getTotalAmountComponent'
import { default as updateComponents, UpdateComponentProps } from './updateComponents'
import { default as deleteComponent } from './deleteComponent'
import { HttpRequest } from 'hooks/useHttp'
import { ApiResponse } from 'api'

export interface ComponentApi {
  addNewComponent: (params: AddNewComponentProps) => Promise<ApiResponse<{}>>
  deleteComponent: (componentId: string) => Promise<ApiResponse<{}>>
  getComponentData: (componentId: string) => Promise<ApiResponse<componentDetail[]>>
  getComponentPurchaseHistory: (
    componentName: string
  ) => Promise<ApiResponse<PurchaseOrderHistory[]>>
  getComponentList: (params: SearchCriteriaComponentList) => Promise<ApiResponse<ComponentData[]>>
  // getTotalAmountComponent: (params: UpdateCustomerDetailProps) => Promise<ApiResponse<{}>>
  updateComponents: (params: UpdateComponentProps) => Promise<ApiResponse<{}>>
}

export default function component(httpRequest: HttpRequest): ComponentApi {
  return {
    addNewComponent: params => addNewComponent(httpRequest, params),
    deleteComponent: componentId => deleteComponent(httpRequest, componentId),
    getComponentData: componentId => getComponentData(httpRequest, componentId),
    getComponentPurchaseHistory: componentName =>
      getComponentPurchaseHistory(httpRequest, componentName),
    getComponentList: params => getComponentList(httpRequest, params),
    // getTotalAmountComponent,
    updateComponents: params => updateComponents(httpRequest, params),
  }
}
