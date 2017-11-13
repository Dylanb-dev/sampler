import Future from 'fluture/index'

export const clearStorage = Future.try(() => localStorage.clear())

export const getItemFromStorage = key =>
  Future.try(() => localStorage.getItem(key)).chain(Future.encase(JSON.parse))

export const storeItem = ({ key, item }) =>
  Future.try(() => JSON.stringify(item)).chain(res =>
    Future.try(() => localStorage.setItem(key, res)).chain(() =>
      Future.try(() => ({ key, item }))
    )
  )

export const removeItemFromStorage = item =>
  Future.try(() => localStorage.removeItem(item))
