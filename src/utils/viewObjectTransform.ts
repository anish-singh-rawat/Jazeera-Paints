import { TFunction } from "i18next";

export interface ViewObjectTransformKeyMapping {
  key: string; // Key in the API response
  name: string; // Desired name for frontend display
  transform?: (value: any) => string | number; // Optional value transformation function
}

function viewObjectTransform<T extends Record<string, any>>(
  data: T,
  t: TFunction,
  keyMappings: ViewObjectTransformKeyMapping[] = []
): { code: string; value: string | number }[] {
  const transformedData: { code: string; value: string | number }[] = [];

  for (const mapping of keyMappings) {
    const { key, name, transform } = mapping;
    const value = data[key] !== undefined ? data[key] : "";

    let transformedValue = value;

    if (transform) {
      // If a transform function is provided, apply it to the value
      transformedValue = transform(value);
    }

    transformedData.push({
      code: t(name),
      value: transformedValue,
    });
  }

  return transformedData;
}

export default viewObjectTransform;
