import { useSelector, useDispatch } from 'react-redux';
import { getAllTodos } from './todos-slice';
import { selectVisibleTodos, toggleTodo } from './todos-slice';
import { useEffect } from 'react';
import { deleteTodo } from './todos-slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const TodoList = () => {
  const activeFilter = useSelector((state) => state.filter);
  const todos = useSelector((state) => selectVisibleTodos(state, activeFilter));
  const dispatch = useDispatch();

  const { error, loading } = useSelector((state) => state.todos);
  // console.log('error => ', error);
  // console.log('loading =>', loading);

  useEffect(() => {
    const promise = dispatch(getAllTodos())
      .unwrap()
      .then(({ payload }) => {
        toast('All Todos were fetch');
      })
      .catch((err) => {
        toast(err);
      });
    return () => {
      promise.abort(); // остановка запроса при размонтировании компонента
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <ul>
        {error && <h2>{error}</h2>}
        {loading === 'loading' && <h2>Loading....</h2>}
        {loading === 'idle' &&
          !error &&
          todos.map((todo) => (
            <li key={todo.id}>
              <input
                type='checkbox'
                checked={todo.completed}
                onChange={() => dispatch(toggleTodo(todo.id))}
              />{' '}
              {todo.title}{' '}
              <button
                onClick={() =>
                  dispatch(deleteTodo(todo.id)).then((data) => toast('Deleted'))
                }
              >
                delete
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};
