
import './App.css';
import { useEffect,useState } from 'react';
import Preloader from './components/preloader';
import { createTodo, readTodos, updateTodo, deleteTodo } from './functions';
// import { deleteTodo } from './api';
function App() {
  const [todo, setTodo] = useState({
    title:'',
    content:''
  })
  const [todos, setTodos] = useState(null);
  const [currentId, setCurrentId] = useState(0);
  useEffect(() => {
    const fetchData = async() =>{
      const result = await readTodos();
      setTodos(result);
    }
    fetchData();
  }, [currentId])
//clearing field 
const  clear = () =>{
  setCurrentId(0);
  setTodo({title:'',content:''}); 
}
useEffect(()=>{
  const clearField = (e) =>{
    if(e.keyCode === 27){
      clear()
    }
  }
  window.addEventListener('keydown',clearField)
  return()=> window.removeEventListener('keydown',clearField)
},[])
  
 
  //submit handler
  const onSibmitHandler = async(e) =>{
    e.preventDefault();
    if(currentId===0){
      const result =  await createTodo(todo);
      setTodos([...todos,result]);
      clear();
    }
    else{
   await updateTodo(currentId,todo);
    clear();
    }
     
  }
//remove to do delete function;
const removeTodo = async(id) =>{
  await deleteTodo(id);
  const todosCopy = [...todos];
  todosCopy.filter(todo=> todo._id !== id);
  setTodos(todosCopy);
}

  //seting current id 
  useEffect(()=>{
  let currentTodo = currentId!=0 ? todos.find(todo=>todo._id === currentId):{title:'',content:''} 
  setTodo(currentTodo);
  },[currentId])


  return (
    <div className="container">
    <div className="row">
  <form className="col s12" onSubmit={onSibmitHandler}>
    <div className="row">
      <div className="input-field col s6">
        <i className="material-icons prefix">title</i>
        <input id="icon_prefix" type="text" value={todo.title} className="validate"
         onChange={e=> setTodo({...todo,title:e.target.value})} />
        <label htmlFor="icon_prefix">Title</label>
      </div>
      <div className="input-field col s6">
        <i className="material-icons prefix">description</i>
        <input id="description" type="tel" value={todo.content} className="validate" 
        onChange={e=> setTodo({...todo,content:e.target.value})} />
        <label htmlFor="icon_telephone">content</label>
      </div>
    </div>
    <div className="row right-align">
      <button className="waves-effect waves-light btn">Submit</button>
    </div>
  </form>
</div>
  { 
    !todos?<Preloader /> : todos.length > 0 ?
    <div className="collection">
    {todos.map(todo=> (
      <ul onClick={()=>setCurrentId(todo._id)} key={todo._id} className="collection with-header">
        <li className="collection-header"><h4>{todo.title}</h4><p>{todo.content}</p>
        </li>
        <li className="collection-item">
        <div>
        <a href="/" onClick={()=>removeTodo(todo._id)} className="secondary-content">
        <i className="material-icons">delete</i>
        </a>
        </div>
        </li>
       </ul>
    ))}
</div>: <div><h2>no data</h2></div>
    }


            

    </div>
  );
}

export default App;
