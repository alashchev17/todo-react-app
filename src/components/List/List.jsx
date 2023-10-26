import React from "react";
import classNames from "classnames";
import axios from "axios";

import "./List.scss";
import removeSvg from "../../assets/img/remove.svg";

const List = ({
  items,
  isRemovable,
  popupHandler,
  onRemove,
  onClickItem,
  activeListItem,
}) => {
  const removeItem = (item) => {
    if (window.confirm("Вы действительно хотите удалить данную папку?")) {
      axios.delete(`http://localhost:3001/lists/${item.id}`).then(() => {
        onRemove(item);
      });
    } else {
      return;
    }
  };

  return (
    <ul onClick={popupHandler} className="list">
      {items.map((item) => {
        let label = item.label;
        if (isRemovable) {
          if (label.length >= 9) {
            label = label.substr(0, 9) + "...";
          }
        }

        return (
          <li
            key={item.id}
            className={classNames(item.className, {
              active:
                item.active ||
                (activeListItem && activeListItem.id === item.id),
            })}
            title={item.label}
            onClick={onClickItem ? () => onClickItem(item) : null}
          >
            <i>
              {item.icon ? (
                item.icon
              ) : (
                <span style={{ backgroundColor: item.color?.hex }}></span>
              )}
            </i>
            <span>{label}</span>
            {isRemovable && (
              <button
                className="list__remove-button"
                onClick={() => removeItem(item)}
              >
                <img src={removeSvg} alt="Remove icon" />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default List;
