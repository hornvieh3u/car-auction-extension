import Login from "../components/Login";
import Logout from "../components/Logout";
import Dashboard from "../components/Dashboard";
import Setting from "../components/Setting";

import { useEffect, useState } from "react";
import { getToken } from "../utilities/store";
import Invoice from "../components/Invoice";

function Content() {
  const [isLogged, setIsLogged] = useState(false);
  const [tab, setTab] = useState('dashboard');

  useEffect(() => {
    let token = getToken();
    if( token ) {
      setIsLogged(true);
    }
  }, []);

  return (
    <div className="content">
      {
        !isLogged ?
          <Login setIsLogged={setIsLogged} /> :
          <>
            <ul className="nav nav-pills my-3 " id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => setTab('dashboard')}
                  className={`nav-link px-2 py-1 ${ tab === 'dashboard' ? 'active' : '' }`}
                  type="button"
                  role="tab"
                >
                  Activities
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => setTab('invoice')}
                  className={`nav-link px-2 py-1 ${ tab === 'invoice' ? 'active' : '' }`}
                  type="button"
                  role="tab"
                >
                  Invoices
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => setTab('setting')}
                  className={`nav-link px-2 py-1 ${ tab === 'setting' ? 'active' : '' }`}
                  type="button"
                  role="tab"
                >
                  Setting
                </button>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div className={`tab-pane fade ${ tab === 'dashboard' ? "show active" : "" }`} role="tabpanel" tabIndex={0}>
                <Dashboard />
              </div>
              <div className={`tab-pane fade ${ tab === 'invoice' ? "show active" : "" }`} role="tabpanel" tabIndex={0}>
                <Invoice />
              </div>
              <div className={`tab-pane fade ${ tab === 'setting' ? "show active" : "" }`} role="tabpanel" tabIndex={0}>
                <Setting />
              </div>
            </div>
            <Logout />
          </>
      }
    </div>
  );
}

export default Content;
