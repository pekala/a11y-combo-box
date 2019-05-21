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

  const onInputFocus = () => setIsOpen(true);
  const onInputBlur = () => setIsOpen(false);
  const onClickOption = (option: Option) => {
    changeValueAndNotify(option);
    setVisibleOptions([option]);
    setInputValue(option.label);
  };
  const onInputChange = e => {
    const nextInputValue = e.target.value;

    setInputValue(e.target.value);
    const nextVisibleOptions = options.filter(
      option =>
        option.label.toLowerCase().indexOf(nextInputValue.toLowerCase()) === 0
    );

    setVisibleOptions(nextVisibleOptions);
    changeValueAndNotify(nextVisibleOptions[0] || null);
  };

  return (
    <>
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
          />
          <button
            id={`${id}-combobox-arrow`}
            tabIndex={-1}
            aria-label={triggerLabel}
          >
            ⬇
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
    </>
  );
};

export default ComboBox;
