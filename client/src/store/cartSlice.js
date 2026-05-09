import { createSlice } from '@reduxjs/toolkit'

const load = () => {
  try { return JSON.parse(localStorage.getItem('cart') ?? '[]') } catch { return [] }
}

const save = (items) => localStorage.setItem('cart', JSON.stringify(items))

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: load(),
    drawerOpen: false,
  },
  reducers: {
    addItem(state, { payload }) {
      const existing = state.items.find(i => i.productId === payload.productId)
      if (existing) {
        existing.quantity += payload.quantity ?? 1
      } else {
        state.items.push({ ...payload, quantity: payload.quantity ?? 1 })
      }
      save(state.items)
    },
    removeItem(state, { payload }) {
      state.items = state.items.filter(i => i.productId !== payload)
      save(state.items)
    },
    updateQuantity(state, { payload: { productId, quantity } }) {
      const item = state.items.find(i => i.productId === productId)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) state.items = state.items.filter(i => i.productId !== productId)
      }
      save(state.items)
    },
    clearCart(state) {
      state.items = []
      localStorage.removeItem('cart')
    },
    openDrawer(state)  { state.drawerOpen = true  },
    closeDrawer(state) { state.drawerOpen = false },
    toggleDrawer(state) { state.drawerOpen = !state.drawerOpen },
  },
})

export const {
  addItem, removeItem, updateQuantity, clearCart,
  openDrawer, closeDrawer, toggleDrawer,
} = cartSlice.actions

export const selectCartItems  = (state) => state.cart.items
export const selectCartTotal  = (state) => state.cart.items.reduce((s, i) => s + i.price * i.quantity, 0)
export const selectCartCount  = (state) => state.cart.items.reduce((s, i) => s + i.quantity, 0)
export const selectDrawerOpen = (state) => state.cart.drawerOpen

export default cartSlice.reducer
