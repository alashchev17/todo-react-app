import React from "react";
import axios from "axios";

import "./Tasks.scss";
import editSvg from "../../assets/img/edit.svg";

import AddTaskForm from "./AddTaskForm.jsx";
import Task from "./Task.jsx";

const Tasks = ({
  list,
  onEditTitle,
  onAddTask,
  onRemoveTask,
  onEditTask,
  onCompleteTask,
  withoutEmpty,
}) => {
  const editTitleHandler = () => {
    const newTitle = window
      .prompt("Введите новое название папки:", list.label)
      .trim();
    if (newTitle) {
      axios
        .patch(`http://localhost:3001/lists/${list.id}`, {
          label: newTitle,
        })
        .then(() => {
          onEditTitle(list.id, newTitle);
        })
        .catch((error) => {
          alert(
            `Не удалось обновить название папки\nОшибка: ${error.message}:${error.code}`,
          );
        });
    } else {
      alert("Некорректное название папки!");
    }
  };

  const removeTask = (taskId) => {
    onRemoveTask(list.id, taskId);
  };

  const editTask = (taskId, taskText) => {
    onEditTask(taskId, taskText);
  };

  const completeTask = (taskId, completed) => {
    onCompleteTask(list.id, taskId, completed);
  };

  return (
    <div className="tasks">
      <h2 className="tasks__title" style={{ color: list.color.hex }}>
        {list.label}
        <img src={editSvg} alt="Edit icon" onClick={editTitleHandler} />
      </h2>
      <span className="tasks__stroke"></span>
      <ul
        className={`tasks__items ${
          !list.tasks.length && withoutEmpty ? "empty" : ""
        }`}
      >
        {!withoutEmpty && !list.tasks.length && (
          <h2 className="tasks__empty">Задачи отсутствуют</h2>
        )}
        {list.tasks.map((task) => (
          <Task
            key={task.id}
            {...task}
            onRemove={removeTask}
            onEdit={editTask}
            onComplete={completeTask}
          />
        ))}
      </ul>
      <AddTaskForm key={list.id} list={list} onAddTask={onAddTask} />
    </div>
  );
};

export default Tasks;
