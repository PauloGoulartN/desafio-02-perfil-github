import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import { fetchGithubUser } from "./services/github.js";
import githubMark from "./assets/github-mark.png";
import githubMarkFlat from "./assets/gh-octocat-flat.png";
import githubWordmark from "./assets/github-wordmark.png";
import "./App.css";

// o layout do Figma tem 1440x810, então aumento ou diminuo a tela pra caber na janela
const FRAME_WIDTH = 1440;
const FRAME_HEIGHT = 810;
// no celular a tela ficaria muito pequena, então abaixo disso uso o layout do App.css (media query)
const MOBILE_WIDTH = 768;

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
}

// as 3 telas do Figma: 'idle' = inicial, 'success' = achou o perfil, 'error' = não achou
export default function App() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("idle");
  const [user, setUser] = useState(null);
  const { width, height } = useWindowSize();
  const isMobile = width < MOBILE_WIDTH;
  // usa o menor dos dois pra tela caber inteira, sem cortar embaixo nem dos lados
  const scale = Math.min(width / FRAME_WIDTH, height / FRAME_HEIGHT);
  // o espaço que sobra é dividido por 2 pra deixar a tela no meio
  const x = (width - FRAME_WIDTH * scale) / 2;
  const y = (height - FRAME_HEIGHT * scale) / 2;
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
      style={isMobile ? undefined : { height }}
    >
      <main
        className={`frame frame--${status}`}
        style={isMobile ? undefined : { transform: `translate(${x}px, ${y}px) scale(${scale})` }}
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
