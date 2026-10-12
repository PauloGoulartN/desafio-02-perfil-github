import searchIcon from "../assets/icon-search.svg";

export default function SearchForm({ value, onChange, onSubmit, loading }) {
  function handleSubmit(event) {
    event.preventDefault(); // pra página não recarregar
    onSubmit();
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <label htmlFor="github-user" className="sr-only">
        Usuário do GitHub
      </label>
      <input
        id="github-user"
        className="search__input"
        type="text"
        placeholder="Digite um usuário do Github"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        spellCheck="false"
      />
      <button
        className="search__button"
        type="submit"
        aria-label="Buscar perfil"
        disabled={loading}
      >
        {loading ? (
          <span className="spinner" />
        ) : (
          <img src={searchIcon} alt="" width="25" height="25" />
        )}
      </button>
    </form>
  );
}
