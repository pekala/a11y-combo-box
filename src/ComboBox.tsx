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
};

const ComboBox: React.FC<ComboBoxProps> = ({
  id: customId,
  label,
  triggerLabel = "Show options",
  options = []
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = React.useMemo(
    () =>
      customId ||
      Math.random()
        .toString(36)
        .substr(2, 15),
    [customId]
  );
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
            type="text"
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            aria-labelledby={`${id}-label`}
            aria-activedescendant={undefined}
            id={`${id}-input`}
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
            options.map(option => (
              <li
                role="option"
                aria-selected={false}
                key={option.id}
                id={`${id}-option-${option.id}`}
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
