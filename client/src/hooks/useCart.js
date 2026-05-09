import { useSelector, useDispatch } from 'react-redux'
import {
  addItem, removeItem, updateQuantity, clearCart,
  openDrawer, closeDrawer, toggleDrawer,
  selectCartItems, selectCartTotal, selectCartCount, selectDrawerOpen,
} from '../store/cartSlice'

export function useCart() {
  const dispatch  = useDispatch()
  const items      = useSelector(selectCartItems)
  const total      = useSelector(selectCartTotal)
  const count      = useSelector(selectCartCount)
  const drawerOpen = useSelector(selectDrawerOpen)

  return {
    items,
    total,
    count,
    drawerOpen,
    addItem:        (item)                => dispatch(addItem(item)),
    removeItem:     (productId)           => dispatch(removeItem(productId)),
    updateQuantity: (productId, quantity) => dispatch(updateQuantity({ productId, quantity })),
    clearCart:      ()                    => dispatch(clearCart()),
    openDrawer:     ()                    => dispatch(openDrawer()),
    closeDrawer:    ()                    => dispatch(closeDrawer()),
    toggleDrawer:   ()                    => dispatch(toggleDrawer()),
  }
}
