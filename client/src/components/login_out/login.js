const Login = ({ user }) => {
  return (
    <nav>
      {!user ? (
        <div className="login">
          <a href="/login">Login</a>
        </div>
      ) : (
        <div className="login">
          <a href="/logout">Logout of {user.name}</a>
        </div>
      )}
    </nav>
  );
};

export default Login;
