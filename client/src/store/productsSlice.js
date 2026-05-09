import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products', { params })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to load products')
    }
  }
)

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchOne',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${slug}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Product not found')
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items:       [],
    current:     null,
    total:       0,
    page:        1,
    totalPages:  1,
    status:      'idle',
    error:       null,
    filters: {
      search:    '',
      category:  '',
      minPrice:  '',
      maxPrice:  '',
      sort:      'newest',
      rating:    '',
    },
  },
  reducers: {
    setFilter(state, { payload }) {
      state.filters = { ...state.filters, ...payload }
      state.page = 1
    },
    setPage(state, { payload }) { state.page = payload },
    clearCurrent(state) { state.current = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,  (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.status     = 'succeeded'
        state.items      = payload.products ?? payload
        state.total      = payload.total      ?? (payload.products?.length ?? 0)
        state.totalPages = payload.totalPages ?? 1
      })
      .addCase(fetchProducts.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload
      })
      .addCase(fetchProductBySlug.pending,  (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchProductBySlug.fulfilled, (state, { payload }) => {
        state.status  = 'succeeded'
        state.current = payload
      })
      .addCase(fetchProductBySlug.rejected, (state, { payload }) => {
        state.status = 'failed'; state.error = payload
      })
  },
})

export const { setFilter, setPage, clearCurrent } = productsSlice.actions
export default productsSlice.reducer
