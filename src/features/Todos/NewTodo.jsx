import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import { createTodo } from './todos-slice';

export const NewTodo = () => {
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.target.title.value) {
      dispatch(createTodo(event.target.title.value))
        .unwrap()
        .then((data) => {
          toast('Добавили туду');
        })
        .catch((data) => {
          toast('При добавлении туду случилась ошибка');
        });
      event.target.reset();
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <input type='text' name='title' placeholder='new todo' />
        <input type='submit' value='Add Todo' />
      </form>
    </>
  );
};
