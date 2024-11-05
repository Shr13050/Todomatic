

import { useEffect, useState } from 'react';
import Navbar from './components/navbar';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [Todo, setTodo] = useState("");
  const [Todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString !== null) {
      try {
        const todos = JSON.parse(todoString);
        setTodos(todos);
      } catch (error) {
        console.error("Failed to parse todos from localStorage:", error);
      }
    }
  }, []);

  const saveToLS = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
    saveToLS(Todos); // Save current todos to localStorage when toggling showFinished
  };

  const handleEdit = (id) => {
    const t = Todos.find(i => i.id === id);
    setTodo(t.Todo);
    const newTodos = Todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleDelete = (id) => {
    const newTodos = Todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const handleAdd = () => {
    if (Todo.trim() === "") return;
    const newTodos = [...Todos, { id: uuidv4(), Todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveToLS(newTodos);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const newTodos = Todos.map(todo =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  return (
    <>
      <Navbar />
      <div className="md:container mx-auto my-5 rounded-xl p-5 bg-violet-300 min-h-[80vh] md:w-1/2">
        <h1 className='text-white my-2 font-bold text-center text-lg'>ToDoMatic - Tasks done today pave the way for tomorrow.📝</h1>
        <div className="addTodo my-5">
          <h2 className='font-bold text-xl text-center'>Add a Todo</h2>
          <input onChange={handleChange} value={Todo} type="text" className='w-96 outline-none mx-auto block'  />
          <button onClick={handleAdd} className='bg-violet-800 hover:bg-violet-900 p-3 py-1 text-white rounded-md m-6 font-semibold block mx-auto'>Save</button>
        </div>
        <input type="checkbox" onChange={toggleFinished} checked={showFinished} /> Show finished Todos
        <h2 className='font-bold text-2xl text-center mt-5'>Your Todos</h2>
        <div className="todos">
          {Todos.length === 0 && <div className='m-5 font-semibold text-center'>Sorry, no todos to display</div>}
          {Todos.map(item => (
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex items-center justify-between w-full my-3 p-3 bg-violet-500 rounded shadow-xl">
                <div className='flex gap-5 items-center flex-1'>
                  <input name={item.id} type="checkbox" onChange={handleCheckbox} checked={item.isCompleted} />
                  <div className={item.isCompleted ? "line-through break-words text-white font-semibold" : "break-words text-white font-semibold"}>{item.Todo}</div>
                </div>
                <div className="buttons flex">
                  <button onClick={() => handleEdit(item.id)} className='bg-violet-800 hover:bg-violet-900 p-3 py-1 text-white rounded-md mx-2 font-semibold'>Edit</button>
                  <button onClick={() => handleDelete(item.id)} className='bg-violet-800 hover:bg-violet-900 p-3 py-1 text-white rounded-md mx-2 font-semibold'>Delete</button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
