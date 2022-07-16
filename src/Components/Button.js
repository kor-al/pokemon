import "./Button.css"

const Button = ({ text, onClick, title, className }) => {
    return (
        <button onClick={onClick} title={title}  className={className}>{text}</button>
    );
}
export default Button;