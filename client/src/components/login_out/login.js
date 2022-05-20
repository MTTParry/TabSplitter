const Login = ({ user }) => {
  return (
    <nav>
      {!user ? (
        <div className="login">
          <a href="http://localhost:5005/login">Login</a>
        </div>
      ) : (
        <div className="login">
          <a href="http://localhost:5005/logout">Logout of {user.name}</a>
        </div>
      )}
    </nav>
  );
};

export default Login;
