import { logOut } from "../utilities/logout"

function Logout() {
  return (
    <div className="logout">
      <button onClick={() => location.reload()} className="btn btn-success mx-1">Refresh</button>
      <button onClick={logOut} className="btn btn-danger mx-1">Logout</button>
    </div>
  );
}

export default Logout;