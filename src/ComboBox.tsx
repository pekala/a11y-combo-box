import * as React from "react";

type Option = {
  label: string;
  id: string | number;
  [key: string]: any;
};
type ComboBoxProps = {
  id?: string;
  label: string;
  triggerLabel?: string;
  options?: Option[];
  onChange?: (selection: Option | null) => void;
};

const ComboBox: React.FC<ComboBoxProps> = ({
  id: customId,
  label,
  triggerLabel = "Show options",
  options = [],
  onChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [visibleOptions, setVisibleOptions] = React.useState(options);

  const id = React.useMemo(
    () =>
      customId ||
      Math.random()
        .toString(36)
        .substr(2, 15),
    [customId]
  );

  const changeValueAndNotify = (option: Option | null) => {
    setSelected(option);
    if (onChange) {
      onChange(option);
    }
  };

  const onTriggerClick = () => setIsOpen(!isOpen);
  const onInputFocus = () => setIsOpen(true);
  const onInputBlur = () => {
    setIsOpen(false);
    if (selected) {
      setInputValue(selected.label);
    } else {
      setInputValue("");
      setVisibleOptions(options);
    }
  };

  const onClickOption = (option: Option) => {
    changeValueAndNotify(option);
    setInputValue(option.label);
    setVisibleOptions([option]);
  };

  const onInputChange = e => {
    const nextInputValue = e.target.value;

    if (!nextInputValue) {
      changeValueAndNotify(null);
      setIsOpen(false);
      setInputValue("");
      setVisibleOptions(options);
      return;
    }

    setInputValue(nextInputValue);
    const nextVisibleOptions = options.filter(
      option =>
        option.label.toLowerCase().indexOf(nextInputValue.toLowerCase()) === 0
    );
    setVisibleOptions(nextVisibleOptions);
    changeValueAndNotify(nextVisibleOptions[0] || null);
  };

  const onInputKeyDown = e => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!isOpen) {
        setIsOpen(true);
      }
      let nextOption;
      if (!selected) {
        nextOption =
          visibleOptions[e.key === "ArrowDown" ? 0 : visibleOptions.length - 1];
      } else {
        const index = visibleOptions.indexOf(selected);
        const offset = e.key === "ArrowDown" ? 1 : -1;
        const n = visibleOptions.length;
        nextOption = visibleOptions[(((index + offset) % n) + n) % n];
      }
      changeValueAndNotify(nextOption);
      setInputValue(nextOption.label);
    } else if (e.key === "Enter") {
      setIsOpen(false);
      if (selected) {
        setVisibleOptions([selected]);
        setInputValue(selected.label);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      changeValueAndNotify(null);
      setInputValue("");
    }
  };

  return (
    <div className="combobox">
      <label id={`${id}-label`}>{label}</label>
      <div>
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-owns={`${id}-listbox`}
          aria-haspopup="listbox"
          id={`${id}-combobox`}
        >
          <input
            value={inputValue}
            type="text"
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            aria-labelledby={`${id}-label`}
            aria-activedescendant={
              selected ? `${id}-option-${selected.id}` : undefined
            }
            id={`${id}-input`}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          />
          <button
            id={`${id}-combobox-arrow`}
            tabIndex={-1}
            aria-label={triggerLabel}
            onClick={onTriggerClick}
          >
            <svg viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
        <ul aria-labelledby={`${id}-label`} role="listbox" id={`${id}-listbox`}>
          {isOpen &&
            visibleOptions.map(option => (
              <li
                role="option"
                aria-selected={!!selected && selected.id === option.id}
                key={option.id}
                id={`${id}-option-${option.id}`}
                onMouseDown={() => onClickOption(option)}
              >
                {option.label}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ComboBox;
