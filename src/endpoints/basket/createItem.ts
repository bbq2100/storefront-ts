import {
  BasketResponseData,
  BasketWith,
  basketWithQueryParameter,
} from 'bapi/endpoints/basket/getBasket';
import {BapiCall} from 'bapi/interfaces/BapiCall';

export interface CreateBasketItemParameters {
  basketKey: string;
  variantId: number;
  quantity: number;
  with?: BasketWith;
  customData?: {[key: string]: any; [key: number]: any};
}

export function createBasketItemRequest(
  params: CreateBasketItemParameters,
): BapiCall<BasketResponseData> {
  return {
    method: 'POST',
    endpoint: `baskets/${params.basketKey}/items`,
    params: {
      ...(params.with
        ? {with: basketWithQueryParameter(params.with).join(',')}
        : undefined),
    },
    data: {
      variantId: params.variantId,
      quantity: params.quantity,
      ...(params.customData !== undefined
        ? {customData: params.customData}
        : undefined),
    },
  };
}
