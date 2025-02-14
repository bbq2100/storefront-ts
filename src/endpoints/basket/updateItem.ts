import {
  BasketItemDisplayData,
  BasketResponseData,
  BasketWith,
  basketWithQueryParameter,
} from 'bapi/endpoints/basket/getBasket';
import {BapiCall} from 'bapi/interfaces/BapiCall';

export interface ItemGroup {
  id: string;
  isMainItem: boolean;
  isRequired: boolean;
}

export interface UpdateBasketItemQuantity {
  basketKey: string;
  itemKey: string;
  quantity: number;
  with?: BasketWith;
  campaignKey?: string;
  skipAvailabilityCheck?: boolean;
  // Beware that specifying any of `customData`, `displayData`, `pricePromotionKey` will update the _entire_ `customData` for the basket item
  customData?: {[key: string]: any; [key: number]: any};
  displayData?: BasketItemDisplayData;
  pricePromotionKey?: string;
  includeItemsWithoutProductData?: boolean;
  itemGroup?: ItemGroup;
}

export function updateBasketItemQuantityRequest(
  params: UpdateBasketItemQuantity,
): BapiCall<BasketResponseData> {
  const customData = params.pricePromotionKey
    ? {...params.customData, pricePromotionKey: params.pricePromotionKey}
    : params.customData;

  return {
    method: 'PATCH',
    endpoint: `baskets/${params.basketKey}/items/${params.itemKey}`,
    params: {
      ...(params.with
        ? {with: basketWithQueryParameter(params.with).join(',')}
        : undefined),
      ...(params.campaignKey ? {campaignKey: params.campaignKey} : undefined),
      ...(params.skipAvailabilityCheck
        ? {skipAvailabilityCheck: params.skipAvailabilityCheck}
        : undefined),
      ...(params.includeItemsWithoutProductData
        ? {
            includeItemsWithoutProductData:
              params.includeItemsWithoutProductData,
          }
        : undefined),
    },
    data: {
      quantity: params.quantity,
      ...(customData !== undefined ? {customData} : undefined),
      ...(params.displayData ? {displayData: params.displayData} : undefined),
      ...(params.itemGroup ? {itemGroup: params.itemGroup} : undefined),
    },
  };
}
