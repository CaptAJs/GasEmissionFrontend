import React from "react";
import "./ReactSelect.css";
import chevronUp from "../../assets/chevron-up.svg";
import chevronDown from "../../assets/chevron-down.svg";
import cross from "../../assets/cross.svg";
const ReactSelect = ({
  disabled,
  onBlur,
  onSelect,
  value,
  defaultText,
  optionsList,
  isMultiSelect,
  setOptionsList,
  emptySelect,
}) => {
  const [showOptionList, setShowOptionList] = React.useState(false);

  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [disabled, showOptionList]);

  const handleOutsideClick = (e) => {
    let classList = e.target.classList;
    if (
      !disabled &&
      showOptionList &&
      !classList.contains("default-select-text") &&
      !classList.contains("react-custom-select") &&
      !classList.contains("active-result") &&
      !classList.contains("chosen-results") &&
      !classList.contains("chosen-drop")
    ) {
      setShowOptionList(false);
      if (onBlur) {
        onBlur();
      }
    }
  };

  const handleListDisplay = () => {
    if (!disabled) {
      setShowOptionList((previousState) => !previousState);
    }
  };

  const removeItemFromList = (selectedOption) => {
    const findIndex = optionsList.findIndex(
      (option) => option.name === selectedOption
    );
    const newOptionsList = [...optionsList];
    newOptionsList[findIndex]["disabled"] = false;
    setOptionsList(newOptionsList, newOptionsList[findIndex]["name"]);
  };
  const removeItem = () => {
    onSelect({ name: "" });
  };

  const handleOptionClick = (option) => {
    setShowOptionList(false);
    onSelect(option);
  };

  const handleFieldBlur = () => {
    if (onBlur && !disabled && !showOptionList) {
      onBlur();
    }
  };

  return (
    <div
      onBlur={handleFieldBlur}
      className="chosen-container react-custom-select chosen-with-drop"
    >
      <div
        tabIndex={0}
        onClick={handleListDisplay}
        className={
          "form-control default-select-text " +
          (disabled ? "disabled" : "") +
          (showOptionList ? "active" : "")
        }
      >
        <div className="title">
          {isMultiSelect ? (
            value.length === 0 ? (
              defaultText
            ) : (
              value.map((selected, index) => (
                <div
                  className="multi-selected"
                  key={index}
                  onClick={() => {
                    if (!disabled) removeItemFromList(selected);
                  }}
                >
                  {selected}
                  <img src={cross} alt="cross" />
                </div>
              ))
            )
          ) : value ? (
            emptySelect ? (
              <div className="single-selected" onClick={() => removeItem()}>
                {value} <img src={cross} alt="cross" />
              </div>
            ) : (
              value
            )
          ) : defaultText ? (
            defaultText
          ) : (
            "Select"
          )}
        </div>
        <img src={showOptionList ? chevronUp : chevronDown} alt="icon" />
      </div>
      {showOptionList && (
        <div className="chosen-drop">
          <ul className="chosen-results">
            {optionsList.map((option, index) => {
              return (
                <li
                  className={
                    "active-result " + (option.disabled ? "disabled " : "")
                  }
                  key={index}
                  onClick={() => {
                    if (!option.disabled) handleOptionClick(option);
                  }}
                >
                  {option.name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReactSelect;
