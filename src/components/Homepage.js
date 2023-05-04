import React, { useEffect, useState} from "react";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./homepage.css";
import AddIcon from "../assets/add-icon.svg";
import AddIconGreyed from "../assets/add-icon-grey.svg";
import barsicon from '../assets/bars-icon.svg'
import AlertDialog from "./AlertDialog.js";

export default function Homepage() {
  const [todo, setTodo] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [showMenu, setShowMenu] = useState(true);
  const [selectedRow, setSelectedRow] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // read
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((oldArray) => [...oldArray, todo]);
              return todo;
            });
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  });

  // update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
    setSelectedRow("");
  };

  // delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
    setSelectedRow("");
  };
  const handleAddNewOnKeyUp = (e) => {
    console.log('event key >>'+ e.key + ' val >> '+isEdit)
    if(e.key === "Enter" && e.target.value.trim() !== ""){
      addTodo(e.target.value.trim())
    }
  }

  const handleAddImgClick = () => {
    if(todo !== ""){
      addTodo(todo)
    }
  };

  const addTodo = (val) => {
    if(isEdit === false){
      setTodo(val);
      console.log('User wants to add >> '+val + ': '+ todo);
      const uidd = uid();
      set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
        todo: todo,
        uidd: uidd,
        completed: false,
      });
    }else{
      update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
        todo: todo,
        tempUidd: tempUidd,
        completed: false,
      });
      setIsEdit(false);
    }
    setTodo("");
  };

  const toggleShowMenu = (uid) => {
      setShowMenu(!showMenu);
      setIsEdit(false);
      setTodo("");
      if(showMenu === true){
        setSelectedRow(uid)
      }else{
        setSelectedRow("")
      }
      
  }

  const handleCompleteTodo = (e, todo) => {
    console.log('checked >> ' + JSON.stringify(todo));
    setTempUidd(todo.uidd);
    update(ref(db, `/${auth.currentUser.uid}/${todo.uidd}`), {
      todo: todo.todo,
      tempUidd: todo.uidd,
      completed: e.target.checked,
    });
  }

  const filterPendingTodos = () => {
    setCurrentFilter("pending");

    onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
      setTodos([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((todo) => {
          setTodos((oldArray) => (!todo.completed ? [...oldArray, todo] : [...oldArray]));
          return todo;
        });
      }
    });
    //setTodos(pendingTodos);
  }

  const filterCompletedTodos = () => {
    setCurrentFilter("completed");
    onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
      setTodos([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((todo) => {
          setTodos((oldArray) => (todo.completed ? [...oldArray, todo] : [...oldArray]));
          return todo;
        });
      }
    });
  }

  const showAllTodos = () => {
    setCurrentFilter("all");
    onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
      setTodos([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((todo) => {
          setTodos((oldArray) => [...oldArray, todo]);
          return todo;
        });
      }
    });
  }

  return (
    <>
    <div className="wrapper">
      <div className="task-input">
        <img className="input-bars-img" src={barsicon} alt="icon" />
        <input type="text" alt="Press Enter to add" value={todo} placeholder="Add a new task" onKeyUp={handleAddNewOnKeyUp} onChange={(e)=> setTodo(e.target.value)}/>
        <img className="input-add-img" onClick={handleAddImgClick} src={todo==="" ? AddIconGreyed : AddIcon} alt="icon" />
      </div>
      <div className="controls">
        <div className="filters">
          <span onClick={()=>{showAllTodos()}} className={currentFilter==='all' ? 'active' : ''} id="all">All</span>
          <span onClick={()=>{filterPendingTodos()}} className={currentFilter==='pending' ? 'active' : ''} id="pending">Pending</span>
          <span onClick={()=>{filterCompletedTodos()}} className={currentFilter==='completed' ? 'active' : ''} id="completed">Completed</span>
        </div>
        <AlertDialog todos={todos} currentFilter={currentFilter} db={db} auth={auth}/>
      </div>
      <ul className="task-box">
      {
      todos.length > 0 ?
        todos.map((todo) => (
            <li key={"li-task-" + todo.uidd} className="task">
              <label>
              <input onChange={(event) => {handleCompleteTodo(event, todo)}} type="checkbox" checked={todo.completed}/>
                <p className={todo.completed ? "todo-completed" : ""}>{todo.todo}</p>
              </label>
              <div className="settings">
                  <i onClick={() => toggleShowMenu(todo.uidd)} className="uil uil-ellipsis-h"></i>
                  <ul key={"ul-ellipsis-" + (todo.uuid)} className={"task-menu " + (selectedRow ===  todo.uidd ? 'show' : '')}>
                      <li key={"li-update-" + (todo.uuid)} onClick={() => handleUpdate(todo)}><i className="uil uil-pen"></i>Edit</li>
                      <li key={"li-delete-" + (todo.uuid)} onClick={() => handleDelete(todo.uidd)}><i className="uil uil-trash"></i>Delete</li>
                  </ul>
              </div>
            </li>
        ))
      :
      <li key={"li-task-empty"} className="task">
         <label>
            <p style={{marginLeft: "70px", color: "grey"}}>No todo to display!</p>
          </label>
      </li>
      }
      </ul>
      <br/>
      
    </div>
    <br />
    </>
  );
}
