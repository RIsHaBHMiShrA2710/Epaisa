import './CreateArticleButton.css';
export const CreateArticleButton = ({onClick}) =>{
    return (
        <button className="floating-button" onClick={onClick}>
            Create Article
        </button>
    );
}