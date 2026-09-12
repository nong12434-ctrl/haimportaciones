/** El JSON guardado puede no tener todos los campos (p. ej. si se añadió un
 *  campo nuevo al tipo después de que el cliente ya hubiera editado la página).
 *  El merge rellena lo que falte con el valor por defecto. */
export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

/** Mezcla un objeto plano guardado sobre sus valores por defecto. */
export function mergeObj<T extends object>(defaults: T, stored: DeepPartial<T> | undefined): T {
  return { ...defaults, ...(stored as Partial<T> | undefined) };
}

/**
 * Mezcla una lista editable: si el cliente ha guardado elementos se usan los
 * suyos (cada uno completado con los campos del elemento por defecto), y si la
 * ha dejado vacía a propósito se respeta la lista vacía.
 */
export function mergeList<T extends object>(
  defaults: T[],
  stored: DeepPartial<T>[] | undefined,
  itemDefaults: T,
): T[] {
  if (!Array.isArray(stored)) return defaults;
  return stored.map((item) => ({ ...itemDefaults, ...(item as Partial<T>) }));
}
