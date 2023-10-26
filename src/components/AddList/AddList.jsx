import React from "react";
import classNames from "classnames";
import axios from "axios";

import List from "../List/List.jsx";

import "./AddList.scss";

const AddList = ({ colors, onAdd }) => {
  const [isPopupActive, setIsPopupActive] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isNetworkOffline, setIsNetworkOffline] = React.useState(false);

  /*
    colors изначально null, потому что при первом рендере компонента <AddList />
    данные с сервера ещё не пришли, поэтому мы используем этот useEffect-хук, чтобы проверить colors
    на true и только после этого внести его в setSelectedColor();
  */

  React.useEffect(() => {
    if (colors) {
      setSelectedColor((prev) => colors[0].id);
    }
  }, [colors]);

  const addList = () => {
    if (inputValue.trim().length === 0) {
      alert("Заполните все поля ввода!");
      return;
    }
    setIsSending(true);
    axios
      .post("http://localhost:3001/lists", {
        label: inputValue,
        colorId: selectedColor,
      })
      .then(({ data }) => {
        setIsSending(true);
        const colorHex = colors.filter((color) => color.id === selectedColor)[0]
          .hex;
        const newListObj = { ...data, color: { hex: colorHex } };
        onAdd(newListObj);
        popupHandler();
        setIsSending(false);
      })
      .catch((error) => {
        setIsSending(false);
        setIsNetworkOffline(true);
        window.setTimeout(() => {
          alert(
            `Интернет-соединение отсутствует\nПерезагрузите страницу\n\n${error.message}:${error.code}`,
          );
          console.log(error);
        }, 300);
      });
  };

  const popupHandler = () => {
    setIsPopupActive((prev) => !prev);
    setInputValue("");
    setSelectedColor(colors[0].id);
  };

  const inputHandler = (event) => {
    setInputValue(event.target.value);
  };

  let buttonStatus = "Добавить";
  if (isSending) {
    buttonStatus = "Добавление...";
  } else if (isNetworkOffline) {
    buttonStatus = "Отсутствует соединение";
  }

  return (
    <div className="add-list">
      <List
        items={[
          {
            className: "add-list__link",
            icon: (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 1V11"
                  stroke="#868686"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 6H11"
                  stroke="#868686"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            label: "Добавить папку",
            id: 7,
          },
        ]}
        popupHandler={popupHandler}
        isPopupActive={isPopupActive}
      />
      {isPopupActive && (
        <div className="add-list__popup">
          <i className="add-list__close" onClick={popupHandler}>
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.315 0C4.62737 0 0 4.62737 0 10.315C0 16.0026 4.62737 20.63 10.315 20.63C16.0026 20.63 20.63 16.0026 20.63 10.315C20.63 4.62737 16.0026 0 10.315 0ZM14.0497 12.928C14.1265 13.0009 14.1879 13.0885 14.2303 13.1855C14.2727 13.2826 14.2953 13.3872 14.2966 13.4931C14.298 13.599 14.2781 13.7041 14.2382 13.8022C14.1983 13.9003 14.1392 13.9894 14.0643 14.0643C13.9894 14.1392 13.9003 14.1983 13.8022 14.2382C13.7041 14.2781 13.599 14.298 13.4931 14.2966C13.3872 14.2953 13.2826 14.2727 13.1855 14.2303C13.0885 14.1879 13.0009 14.1265 12.928 14.0497L10.315 11.4373L7.70203 14.0497C7.55202 14.1922 7.35226 14.2705 7.14536 14.2679C6.93846 14.2652 6.74077 14.1819 6.59446 14.0355C6.44814 13.8892 6.36477 13.6915 6.36212 13.4846C6.35947 13.2777 6.43775 13.078 6.58028 12.928L9.19275 10.315L6.58028 7.70203C6.43775 7.55202 6.35947 7.35226 6.36212 7.14536C6.36477 6.93846 6.44814 6.74077 6.59446 6.59446C6.74077 6.44814 6.93846 6.36477 7.14536 6.36212C7.35226 6.35947 7.55202 6.43775 7.70203 6.58028L10.315 9.19275L12.928 6.58028C13.078 6.43775 13.2777 6.35947 13.4846 6.36212C13.6915 6.36477 13.8892 6.44814 14.0355 6.59446C14.1819 6.74077 14.2652 6.93846 14.2679 7.14536C14.2705 7.35226 14.1922 7.55202 14.0497 7.70203L11.4373 10.315L14.0497 12.928Z"
                fill="#5C5C5C"
              />
            </svg>
          </i>
          <input
            value={inputValue}
            onChange={inputHandler}
            className="input add-list__input"
            type="text"
            placeholder="Название папки"
          />
          <div className="add-list__colors">
            <ul>
              {colors.map((color) => (
                <li
                  onClick={() => setSelectedColor(color.id)}
                  title={color.name}
                  key={color.id}
                  className={classNames(
                    "add-list__color",
                    selectedColor === color.id ? "active" : "",
                  )}
                  style={{ backgroundColor: color.hex }}
                ></li>
              ))}
            </ul>
          </div>
          <button
            className="button button--primary"
            type="button"
            onClick={addList}
            disabled={isSending || isNetworkOffline}
          >
            {buttonStatus}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddList;
