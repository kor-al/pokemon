import "./Dropdown.css"

const Dropdown = ({ label, value, options, className, onChange }) => {
    return (
      <label>
        {label}
        <select value={value} className={className} onChange={onChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  };

export default Dropdown;