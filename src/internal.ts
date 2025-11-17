import type { VendorsBehavioursApi } from "./types";

export const cfidKey = "scriptrunner-vendors-api-cfid";
export const storedValueKey = "scriptrunner-vendors-api-stored-value";
export const apiKey = "scriptrunner-vendors-api";

const dataKey = `data-${apiKey}`;

export const hasVendorsApi = (customFieldId: string): boolean => {
  const $field = getApiNode(customFieldId);
  return $field != null && $field.data(apiKey) != null;
};

export const getVendorsApi = (
  customFieldId: string,
): VendorsBehavioursApi<any> | null => {
  const $node = getApiNode(customFieldId);
  return $node ? $node.data(apiKey) : null;
};

export const getField = (fieldId: string): JQuery<HTMLElement> | null => {
  const el = document.getElementById(fieldId);
  return el ? AJS.$(el) : null;
};

export const getApiNode = (fieldId: string): JQuery<HTMLElement> | null => {
  const $field = getField(fieldId);
  if ($field == null || $field.attr(dataKey) === "true") {
    return $field;
  }

  const $parentFields = $field.parents(`[${dataKey}='true']`);
  if ($parentFields.length > 0) {
    return $parentFields.first();
  }

  return null;
};
