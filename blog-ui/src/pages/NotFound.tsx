import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-ghost">
        <div className="ghost-body">
          <div className="ghost-eyes">
            <span></span>
            <span></span>
          </div>
          <div className="ghost-mouth"></div>
        </div>
        <div className="ghost-shadow"></div>
      </div>

      <h1>404</h1>
      <p>Oops... looks like this page got lost in the blogosphere.</p>

      <a href="/" className="notfound-button">
        Take me home
      </a>
    </div>
  );
}