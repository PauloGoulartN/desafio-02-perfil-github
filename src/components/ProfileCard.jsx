export default function ProfileCard({ user }) {
  return (
    <article className="profile">
      <img
        className="profile__avatar"
        src={user.avatarUrl}
        alt={`Foto de perfil de ${user.name}`}
        width="220"
        height="220"
      />
      <h2 className="profile__name">{user.name}</h2>
      {user.bio && <p className="profile__bio">{user.bio}</p>}
    </article>
  );
}
