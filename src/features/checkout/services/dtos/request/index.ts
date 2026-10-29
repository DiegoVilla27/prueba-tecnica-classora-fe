/** Body of `POST /sales/{id}/lines`: only code and quantity, never a price. */
export interface AddLineRequestDto {
  code: string;
  quantity: number;
}

/** Body of `PATCH /sales/{id}/lines/{lineId}`. */
export interface ChangeQuantityRequestDto {
  quantity: number;
}
