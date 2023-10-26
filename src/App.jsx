import React from "react";
import axios from "axios";
import { Route, useHistory } from "react-router-dom";

import List from "./components/List/List.jsx";
import "./scss/App.scss";
import AddList from "./components/AddList/AddList.jsx";

import Tasks from "./components/Tasks/Tasks.jsx";

const App = () => {
  const [lists, setLists] = React.useState(null);
  const [colors, setColors] = React.useState(null);
  // создаём состояние "загруженности" для отлова ошибок во время получения данных с бекенда
  const [isLoadingLists, setIsLoadingLists] = React.useState(true);
  const [activeListItem, setActiveListItem] = React.useState(null);
  const [update, setUpdate] = React.useState(null);

  let history = useHistory();

  const onAddList = () => {
    axios
      .get("http://localhost:3001/lists?_expand=color&_embed=tasks")
      .then(({ data }) => {
        setLists(data);
      })
      .catch(() => {
        alert(
          "Произошла ошибка во время отправки запроса!\nПерезагрузите приложение",
        );
      });
  };

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map((item) => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setLists(newList);
  };

  const onEditTask = (taskId, taskText) => {
    setUpdate(true);
    const newList = lists.map((list) => {
      if (list.id === taskId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskId) {
            task.text = taskText;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    setUpdate(false);
  };

  const onRemoveList = (item) => {
    const newList = lists.filter((list) => list.id !== item.id);
    setLists(newList);
    goHome();
  };

  const onRemoveTask = (listId, taskId) => {
    axios
      .delete(`http://localhost:3001/tasks/${taskId}`)
      .then(() => {
        const newList = lists.map((item) => {
          if (item.id === listId) {
            item.tasks = item.tasks.filter((task) => task.id !== taskId);
          }
          return item;
        });
        setLists(newList);
      })
      .catch((error) => {
        alert(
          `Не удалось удалить данную задачу!\n${error.message}:${error.code}`,
        );
      });
  };

  const onCompleteTask = (listId, taskId, completed) => {
    setUpdate(true);
    const newList = lists.map((list) => {
      if (list.id === taskId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    axios
      .patch(`http://localhost:3001/tasks/${taskId}`, {
        completed,
      })
      .then(() => {
        setLists(newList);
        setUpdate(false);
      })
      .catch((error) => {
        alert(`Не удалось обновить задачу\n${error.message}:${error.code}`);
        setUpdate(false);
      });
  };

  const onSetActiveListItem = (list) => {
    history.push(`/lists/${list.id}`);
  };

  const onSetEditedTitle = (id, title) => {
    const newList = lists.map((item) => {
      if (item.id === id) {
        item.label = title;
      }
      return item;
    });
    setLists(newList);
  };

  const goHome = () => {
    history.push("/");
  };

  // получаем все данные через GET-запрос
  React.useEffect(() => {
    axios
      .get("http://localhost:3001/lists?_expand=color&_embed=tasks")
      .then(({ data }) => {
        setLists(data);
      })
      .catch(() => {
        // если данные не загрузились, то изменять состояние isLoadedLists, isLoadedTasks на false;
        setIsLoadingLists(false);
      });
    axios
      .get("http://localhost:3001/colors")
      .then(({ data }) => {
        setColors(data);
      })
      .catch(() => {
        // если данные не загрузились, то изменять состояние isLoadedLists, isLoadedTasks на false;
        setIsLoadingLists(false);
      });
  }, [update]);

  React.useEffect(() => {
    const listId = history.location.pathname.split("lists/")[1];
    if (lists) {
      const list = lists.find((list) => list.id === Number(listId));
      setActiveListItem(list);
    }
  }, [lists, history.location.pathname]);

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List
          items={[
            {
              label: "Все задачи",
              active: !activeListItem,
              icon: (
                <svg
                  width="14"
                  height="12"
                  viewBox="0 0 14 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.96 5.10001H5.74001C5.24321 5.10001 5.20001 5.50231 5.20001 6.00001C5.20001 6.49771 5.24321 6.90001 5.74001 6.90001H10.96C11.4568 6.90001 11.5 6.49771 11.5 6.00001C11.5 5.50231 11.4568 5.10001 10.96 5.10001ZM12.76 9.60001H5.74001C5.24321 9.60001 5.20001 10.0023 5.20001 10.5C5.20001 10.9977 5.24321 11.4 5.74001 11.4H12.76C13.2568 11.4 13.3 10.9977 13.3 10.5C13.3 10.0023 13.2568 9.60001 12.76 9.60001ZM5.74001 2.40001H12.76C13.2568 2.40001 13.3 1.99771 13.3 1.50001C13.3 1.00231 13.2568 0.600006 12.76 0.600006H5.74001C5.24321 0.600006 5.20001 1.00231 5.20001 1.50001C5.20001 1.99771 5.24321 2.40001 5.74001 2.40001ZM2.86001 5.10001H1.24001C0.743212 5.10001 0.700012 5.50231 0.700012 6.00001C0.700012 6.49771 0.743212 6.90001 1.24001 6.90001H2.86001C3.35681 6.90001 3.40001 6.49771 3.40001 6.00001C3.40001 5.50231 3.35681 5.10001 2.86001 5.10001ZM2.86001 9.60001H1.24001C0.743212 9.60001 0.700012 10.0023 0.700012 10.5C0.700012 10.9977 0.743212 11.4 1.24001 11.4H2.86001C3.35681 11.4 3.40001 10.9977 3.40001 10.5C3.40001 10.0023 3.35681 9.60001 2.86001 9.60001ZM2.86001 0.600006H1.24001C0.743212 0.600006 0.700012 1.00231 0.700012 1.50001C0.700012 1.99771 0.743212 2.40001 1.24001 2.40001H2.86001C3.35681 2.40001 3.40001 1.99771 3.40001 1.50001C3.40001 1.00231 3.35681 0.600006 2.86001 0.600006Z"
                    fill="#7C7C7C"
                  />
                </svg>
              ),
              id: 1,
            },
          ]}
          onClickItem={goHome}
        />
        {/* проверяем, если lists === true (не null), после этого только его рендерим и в пропс передаём lists */}
        {lists ? (
          // проверяем, если lists.length !== 0, после этого только его рендерим и в пропс передаём lists
          lists.length !== 0 ? (
            <List
              items={lists}
              onRemove={(item) => onRemoveList(item)}
              onClickItem={onSetActiveListItem}
              activeListItem={activeListItem}
              isRemovable
            />
          ) : (
            <ul className="list">
              <li>Папок нет</li>
            </ul>
          )
        ) : (
          <ul className="list">
            <li>{isLoadingLists ? "Загрузка..." : "Ошибка загрузки"}</li>
          </ul>
        )}
        <AddList onAdd={onAddList} colors={colors} />
      </div>
      <div className="todo__tasks">
        <Route exact path="/">
          {lists &&
            lists.map((list) => (
              <Tasks
                key={list.id}
                list={list}
                onAddTask={onAddTask}
                onEditTitle={onSetEditedTitle}
                onEditTask={onEditTask}
                onRemoveTask={onRemoveTask}
                onCompleteTask={onCompleteTask}
                withoutEmpty
              />
            ))}
        </Route>
        <Route path="/lists/:id">
          {lists && activeListItem && (
            <Tasks
              list={activeListItem}
              onAddTask={onAddTask}
              onEditTitle={onSetEditedTitle}
              onEditTask={onEditTask}
              onRemoveTask={onRemoveTask}
              onCompleteTask={onCompleteTask}
            />
          )}
        </Route>
      </div>
    </div>
  );
};

export default App;
