import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { resetToDefault } from '../Reset/reset-action';

export const createTodo = createAsyncThunk(
  '@@todos/create-todo',
  async (title, { dispatch }) => {
    // dispatch({ type: 'SET_LOADING' }); // якобы
    const res = await fetch('http://localhost:3001/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, completed: false }),
    });
    const data = await res.json();
    console.log(data);
    return data;
  }
);

export const getAllTodos = createAsyncThunk('@@todox/get-todos', async () => {
  const res = await fetch('http://localhost:3001/todos');
  const data = await res.json();
  return data;
});

export const toggleTodo = createAsyncThunk(
  '@@todos/toggleTodo',
  async (id, { getState }) => {
    const todo = getState().todos.entities.find((item) => item.id === id);
    const res = await fetch(`http://localhost:3001/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    const data = await res.json();
    return data;
  }
);

export const deleteTodo = createAsyncThunk(
  '@@todos/delete-todo',
  async (id, { dispatch, getState }) => {
    const res = await fetch(`http://localhost:3001/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
          state.loading = 'idle';
          state.error = 'ERRORRRR!';
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
