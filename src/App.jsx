import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import { fetchGithubUser } from "./services/github.js";
import githubMark from "./assets/github-mark.png";
import githubMarkFlat from "./assets/gh-octocat-flat.png";
import githubWordmark from "./assets/github-wordmark.png";
import "./App.css";

// o layout do Figma tem 1440 de largura, então aumento ou diminuo a tela pra caber na janela
const FRAME_WIDTH = 1440;
// no celular a tela ficaria muito pequena, então abaixo disso uso o layout do App.css (media query)
const MOBILE_WIDTH = 768;

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

// as 3 telas do Figma: 'idle' = inicial, 'success' = achou o perfil, 'error' = não achou
export default function App() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("idle");
  const [user, setUser] = useState(null);
  const width = useWindowWidth();
  const isMobile = width < MOBILE_WIDTH;
  const scale = width / FRAME_WIDTH;
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    const term = username.trim();
    if (!term) return;

    setLoading(true); // começou a busca

    try {
      setLoading(true);
      const data = await fetchGithubUser(term);
      setUser(data);
      setStatus("success");
    } catch {
      setUser(null);
      setStatus("error");
    } finally {
      setLoading(false); //terminou a busca, deu certo ou deu erro
    }
  }

  return (
    <div
      className="viewport"
      style={isMobile ? undefined : { height: 810 * scale }}
    >
      <main
        className={`frame frame--${status}`}
        style={isMobile ? undefined : { transform: `scale(${scale})` }}
      >
        {/* fundo */}
        <span className="dots" aria-hidden="true" />
        <span className="glow glow--right" aria-hidden="true" />
        <span className="panel" aria-hidden="true" />
        <span className="glow glow--left" aria-hidden="true" />

        <h1 className="title">
          <img
            className="title__mark"
            src={status === "idle" ? githubMark : githubMarkFlat}
            alt=""
          />
          <span className="title__text">Perfil</span>
          <img className="title__wordmark" src={githubWordmark} alt="GitHub" />
        </h1>

        <SearchForm
          value={username}
          onChange={setUsername}
          onSubmit={handleSearch}
          loading={loading}
        />

        {status === "success" && user && <ProfileCard key={user.avatarUrl} user={user} />} 

        {status === "error" && (
          <ErrorMessage>
            Nenhum perfil foi encontrado com esse nome de usuário.
            <br />
            Tente novamente
          </ErrorMessage>
        )}
      </main>
    </div>
  );
}
