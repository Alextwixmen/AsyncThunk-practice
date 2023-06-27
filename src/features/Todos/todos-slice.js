import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { resetToDefault } from '../Reset/reset-action';

export const createTodo = createAsyncThunk(
  '@@todos/create-todo',
  async (title, { dispatch, extra: api }) => {
    return api.createTodo(title);
  }
);

export const getAllTodos = createAsyncThunk(
  '@@todox/get-todos',
  async (_, { rejectWithValue, extra: api }) => {
    try {
      return api.getAllTodos();
    } catch (err) {
      return rejectWithValue('Failed To fetch all todos.');
    }
  },
  // отмена запроса, если он уже идет через третий параметр condition createAsyncThunk
  {
    condition: (_, { getState, extra }) => {
      const { loading } = getState().todos;
      if (loading === 'loading') {
        return false;
      }
    },
  }
);

export const toggleTodo = createAsyncThunk(
  '@@todos/toggleTodo',
  async (id, { getState, extra: api }) => {
    const todo = getState().todos.entities.find((item) => item.id === id);

    return api.toggleTodo(id, { completed: !todo.completed });
  }
);

export const deleteTodo = createAsyncThunk(
  '@@todos/delete-todo',
  async (id, { getState, extra: api }) => {
    api.deleteTodo(id);
    return id;
  }
);

const todoSlice = createSlice({
  name: '@@todos',
  initialState: {
    entities: [],
    loading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetToDefault, () => {
        return [];
      })
      // ловим все через addMatcher()
      // .addCase(getAllTodos.pending, (state, action) => {
      //   state.loading = 'loading';
      //   state.error = null;
      // })
      // .addCase(getAllTodos.rejected, (state, action) => {
      //   (state.loading = 'idle'), (state.error = 'Something went wrong!');
      // })
      .addCase(getAllTodos.fulfilled, (state, action) => {
        state.entities = action.payload;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (todo) => todo.id !== action.payload
        );
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const updatedTodo = action.payload;
        const index = state.entities.findIndex(
          (todo) => todo.id === updatedTodo.id
        );
        state.entities[index] = updatedTodo;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          console.log(action);
          state.loading = 'idle';
          state.error = action.payload || action.error.message;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.loading = 'idle';
        }
      );
  },
});

export const todoReducer = todoSlice.reducer;

export const selectVisibleTodos = (state, filter) => {
  switch (filter) {
    case 'all': {
      return state.todos.entities;
    }
    case 'active': {
      return state.todos.entities.filter((todo) => !todo.completed);
    }
    case 'completed': {
      return state.todos.entities.filter((todo) => todo.completed);
    }
    default: {
      return state.todos;
    }
  }
};
