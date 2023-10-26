import React from "react";
import axios from "axios";

const AddTaskForm = ({ list, onAddTask }) => {
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const onInputChangeHandler = (event) => {
    setInputValue(event.target.value);
  };

  const formVisibilityHandler = () => {
    setIsFormVisible((prev) => !prev);
    setInputValue("");
  };

  const addNewTask = () => {
    if (inputValue.trim()) {
      const obj = {
        listId: list.id,
        text: inputValue,
        completed: false,
      };
      setIsSending(true);
      axios
        .post("http://localhost:3001/tasks/", obj)
        .then(({ data }) => {
          onAddTask(list.id, data);
          formVisibilityHandler();
          setIsSending(false);
        })
        .catch((error) => {
          alert(
            `Произошла ошибка во время отправки запроса\n${error.message}:${error.code}`,
          );
        });
    } else {
      alert("Введите название задачи!");
    }
  };

  return (
    <div className="tasks__form">
      {!isFormVisible ? (
        <div className="tasks__form-new" onClick={formVisibilityHandler}>
          <i className="tasks__form-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1V15"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 8H15"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </i>
          <span>Новая задача</span>
        </div>
      ) : (
        <div className="tasks__form-add">
          <input
            type="text"
            className="input"
            placeholder="Текст задачи"
            value={inputValue}
            onChange={onInputChangeHandler}
          />
          <div className="tasks__form-buttons">
            <button
              className="button button--primary"
              type="button"
              onClick={addNewTask}
              disabled={isSending}
            >
              {isSending ? "Добавление..." : "Добавить задачу"}
            </button>
            <button
              className="button button--secondary"
              type="button"
              onClick={formVisibilityHandler}
              disabled={isSending}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskForm;
