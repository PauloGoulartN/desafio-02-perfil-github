const API_URL = 'https://api.github.com/users';

// busca o usuário na API do GitHub
export async function fetchGithubUser(username) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(username)}`);

  // se não achar o perfil a API devolve 404, aí eu jogo um erro
  if (!response.ok) {
    throw new Error('Perfil não encontrado');
  }

  const data = await response.json();

  // pego só nome, foto e bio (se a pessoa não tiver nome, uso o login)
  return {
    name: data.name || data.login,
    avatarUrl: data.avatar_url,
    bio: data.bio,
  };
}
