import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message ?? 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message ?? 'Registration failed')
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout')
})

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me')
    return data
  } catch {
    return rejectWithValue(null)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError(state) { state.error = null },
    setUser(state, action) { state.user = action.payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,  (state) => { state.status = 'loading'; state.error = null })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.user  = payload.user
        state.token = payload.token ?? null
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload
      })
      .addCase(registerUser.pending,  (state) => { state.status = 'loading'; state.error = null })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.user  = payload.user
        state.token = payload.token ?? null
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; state.token = null; state.status = 'idle'
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchMe.fulfilled, (state, { payload }) => {
        state.user = payload; state.status = 'succeeded'
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null; state.status = 'idle'
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
