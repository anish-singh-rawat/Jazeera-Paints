export function isValueUnique<T>(
  data: Array<T>,
  value: string | undefined,
  property: string,
  item: any
): boolean {
  const isCreatingNewItem = !item?.id;
  const normalizedValue = value?.toLowerCase();

  function isValueInData(valueToCheck: string): boolean {
    return data?.some(
      (record) =>
        (record as Record<string, string>)[property]?.toLowerCase() ===
        valueToCheck
    );
  }

  if (isCreatingNewItem) {
    return !isValueInData(normalizedValue || "");
  }

  const currentItemIndex = data?.findIndex(
    (record) => (record as Record<string, any>).id == item?.id
  );

  if (currentItemIndex === -1) {
    return true;
  }

  return (
    !isValueInData(normalizedValue || "") ||
    (data[currentItemIndex] as Record<string, string>)[
      property
    ]?.toLowerCase() === normalizedValue
  );
}
