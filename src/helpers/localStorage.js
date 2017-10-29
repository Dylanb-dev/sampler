export const clearStorage = () => localStorage.clear()

export const getItemFromStorage = ({ key }) =>
  JSON.parse(localStorage.getItem(key))

export const storeItem = ({ key, item }) =>
  localStorage.setItem(key, JSON.stringify(item))

export const removeItemFromStorage = ({ item }) => localStorage.removeItem(item)
