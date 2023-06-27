import { useSelector, useDispatch } from 'react-redux';
import { getAllTodos } from './todos-slice';
import { selectVisibleTodos, toggleTodo } from './todos-slice';
import { useEffect } from 'react';
import { deleteTodo } from './todos-slice';
export const TodoList = () => {
  const activeFilter = useSelector((state) => state.filter);
  const todos = useSelector((state) => selectVisibleTodos(state, activeFilter));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTodos());
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input
            type='checkbox'
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />{' '}
          {todo.title}{' '}
          <button onClick={() => dispatch(deleteTodo(todo.id))}>delete</button>
        </li>
      ))}
    </ul>
  );
};
