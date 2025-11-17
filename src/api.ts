import { getField, apiKey } from "./internal";
import type { VendorsBehavioursApi } from "./types";

export const init = <T>(
  customFieldId: string,
  apiSpec: VendorsBehavioursApi<T>,
): void => {
  const field = getField(customFieldId);
  if (field) {
    field.data(apiKey, apiSpec);
    field.attr(`data-${apiKey}`, "true");
  }
};
