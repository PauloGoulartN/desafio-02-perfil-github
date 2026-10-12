export default function ErrorMessage({ children }) {
  return (
    <div className="error" role="alert">
      {children}
    </div>
  );
}
