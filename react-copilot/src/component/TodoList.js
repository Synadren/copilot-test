import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Button } from "./button";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";

export const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);

    // rewrite updateTodo to update todos in state and delete todo
    const updateTodo = useCallback(
        (todo) => {
            setTodos((prevTodos) => prevTodos.map((t) => t.id === todo.id ? todo : t).filter((t) => !t.deleted));
        },
        [setTodos]
    );

    // fetch todos from api
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const result = await axios("https://jsonplaceholder.typicode.com/todos");
                const todos = result.data.slice(0, 10).map((todo) => ({ ...todo, userId: Math.floor(Math.random() * 10) + 1 }));
                setTodos(todos);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchTodos();
    }, []);

    // get all userId from todos
    const userIds = useMemo(
        () => [...new Set(todos.map((todo) => todo.userId))],
        [todos]
    );


    // get all users from userIds
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            const result = await axios("https://jsonplaceholder.typicode.com/users");
            const users = result.data.filter((user) => userIds.includes(user.id));
            setUsers(users);
        };
        fetchUsers();
    }, [userIds]);

    // set an array of active users
    const [activeUsers, setActiveUsers] = useState(userIds);
    const handleUserClick = useCallback(
        (userId) => {
            setActiveUsers((prevUsers) => prevUsers.includes(userId) ? prevUsers.filter((id) => id !== userId) : [...prevUsers, userId]);
        },
        [setActiveUsers]
    );

    // get todos of active users
    const activeTodos = useMemo(
        () => {
            const active = todos.filter((todo) => activeUsers.includes(todo.userId))
            return active.length > 0 ? active : todos;
        },
        [todos, activeUsers]
    );

    // reorder todos by drag and drop
    const handleDragStart = useCallback(
        (e, index) => {
            e.dataTransfer.setData("index", index);
        },
        []
    );

    const handleDragOver = useCallback(
        (e) => {
            e.preventDefault();
        },
        []
    );

    const handleDrop = useCallback(
        (e, index) => {
            const newIndex = e.dataTransfer.getData("index");
            const newTodos = [...todos];
            newTodos.splice(index, 0, newTodos.splice(newIndex, 1)[0]);
            setTodos(newTodos);
        },
        [todos, setTodos]
    );

    // function to create new todo
    const [title, setTitle] = useState("");
    const handleTitleChange = useCallback(
        (e) => {
            setTitle(e.target.value);
        },
        [setTitle]
    );

    const handleAddTodo = useCallback(
        () => {
            const newTodo = {
                userId: 1,
                id: todos.length + 1,
                title: title,
                completed: false
            };
            setTodos((prevTodos) => [...prevTodos, newTodo]);
            setTitle("");
        },
        [todos, title, setTitle, setTodos]
    );




    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div className="mx-8 my-4 bg-slate-100 rounded-xl p-8 shadow-lg">
            <h2 className="font-bold text-3xl text-center uppercase text-slate-300">Todo List</h2>

            <div className="flex justify-center items-center gap-6 my-4">
                {users.map((user) => (
                    <div key={user.id} className={`transition cursor-pointer flex flex-col justify-center items-center gap-1 text-center ${activeUsers.includes(user.id) ? 'opacity-100' : 'opacity-50'}`} onClick={() => handleUserClick(user.id)}>
                        <img className="w-6 h-6 rounded-full" src={`https://i.pravatar.cc/150?img=${user.id}`} alt={user.name} />
                        <h3 className="text-slate-800 text-center text-xs font-bold">{user.name}</h3>
                    </div>
                ))}
            </div>

            {activeTodos.map((todo, index) => (
                <div key={todo.id} draggable="true" onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}>
                    <TodoItem todo={todo} updateTodo={updateTodo} />
                </div>
            ))}
            <div className="flex items-center gap-4 cursor-grab">

                <input placeholder="new task" className="flex-1 rounded px-4" type="text" value={title} onChange={handleTitleChange} />
                <Button onClick={handleAddTodo} icon={<FaPlus />}>Add task</Button>
            </div>
        </div>
    );
};


const TodoItem = React.memo(({ todo, updateTodo }) => {
    const handleClick = useCallback(
        () => updateTodo({ ...todo, completed: !todo.completed }),
        [todo, updateTodo]
    );

    const textClass = useMemo(
        () => `cursor-pointer transition ${todo.completed ? "text-emerald-300 line-through" : "text-slate-600"}`,
        [todo.completed]
    );

    //component to edit todo title
    const [edit, setEdit] = useState(false);
    const [title, setTitle] = useState(todo.title);

    const handleEdit = useCallback(
        () => setEdit(true),
        [setEdit]
    );

    const handleSave = useCallback(
        () => {
            setEdit(false);
            updateTodo({ ...todo, title: title });
        },
        [setEdit, title, updateTodo]
    );

    // function to delete todo
    const handleDelete = useCallback(
        () => {
            updateTodo({ ...todo, deleted: true });
        },
        [updateTodo]
    );

    // get user from todo userId
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            const result = await axios(`https://jsonplaceholder.typicode.com/users/${todo.userId}`);
            setUser(result.data);
        };
        fetchUser();
    }, [todo.userId]);


    return (
        <div className="flex items-center gap-4">
            <Button onClick={handleDelete} color="amber" shape="round"><FaTrashAlt /></Button>
            {edit ? <div className="flex-1 flex items-center gap-4">

                <input className="flex-1 rounded px-4" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Button onClick={handleSave}><FaEdit /></Button>
            </div> :
                <div className="flex-1 flex items-center gap-4">

                    <div className="flex-1 flex items-center gap-1" onClick={handleClick}>
                        <input type="checkbox" checked={todo.completed} readOnly />
                        <h3 className={textClass}>{todo.title}</h3>
                    </div>
                    <Button onClick={handleEdit}><FaEdit /></Button>
                </div>}
        </div>
    );
});