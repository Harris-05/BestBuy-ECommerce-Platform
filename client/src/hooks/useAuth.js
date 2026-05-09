import { useSelector, useDispatch } from 'react-redux'
import { loginUser, logoutUser, registerUser } from '../store/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, status, error } = useSelector((s) => s.auth)

  return {
    user,
    status,
    error,
    isAuthenticated: !!user,
    isAdmin:  user?.role === 'admin',
    isSeller: user?.role === 'seller' || user?.role === 'admin',
    login:    (creds)   => dispatch(loginUser(creds)),
    register: (payload) => dispatch(registerUser(payload)),
    logout:   ()        => dispatch(logoutUser()),
  }
}
