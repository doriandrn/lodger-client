export const sanitizeDBItems = items => Object.freeze(items.map(item => item._data))
