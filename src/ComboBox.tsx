import * as React from "react";

type ComboBoxProps = {
  id: string;
  label: string;
  triggerLabel?: string;
};

const ComboBox: React.FC<ComboBoxProps> = ({
  id,
  label,
  triggerLabel = "Show options"
}) => {
  return (
    <>
      <label id={`${id}-label`}>{label}</label>
      <div>
        <div
          role="combobox"
          aria-expanded={false}
          aria-owns={`${id}-listbox`}
          aria-haspopup="listbox"
          id={`${id}-combobox`}
        >
          <input
            type="text"
            aria-autocomplete="both"
            aria-controls={`${id}-listbox`}
            aria-labelledby={`${id}-label`}
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
        <ul
          aria-labelledby={`${id}-label`}
          role="listbox"
          id={`${id}-listbox`}
        />
      </div>
    </>
  );
};

export default ComboBox;
