import React, { useEffect, useState } from "react";
import Axios from "axios";
import { config } from "../config";
import { saveToken } from "../utilities/store";

function Login(props: any) {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ alert, setAlert ] = useState({ msg: '', success: false });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if( !email || !password ) {
      return setAlert({msg: 'Please input correctly!', success: false});
    }
    
    Axios
      .post(
        `${config.API_URL}/login/user`,
        { email, password }
      )
      .then(response => {
        setAlert({msg: 'Login success.', success: true});
        setTimeout(() => {
          let data = response.data;
          saveToken(data.token);
          props.setIsLogged(true);
          if( chrome && chrome.storage ) {
            let accounts: any = {};
            data.accounts.map((account: any) => {
              accounts[account.type] = {
                username: account.username,
                password: account.password
              }
            })
            chrome.storage.local.set({ accounts, token: data.token, email: data.email })
          }
        }, 1000);
      })
      .catch(err => {
        if( err.response && err.response.data ) {
          setAlert({msg: err.response.data, success: false})
        } else {
          setAlert({msg: 'Server Error!', success: false})
        }
      })
  }

  return (
    <div className={`login px-5`}>
      {
        !alert.msg ?
          '' :
          <div className={`alert ${ alert.success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show p-2 text-center`} role="alert">
            {alert.msg}
          </div>
      }
      <div>
        <form className="row" onSubmit={submit}>
          <div className="col-md-12 mb-5">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" onChange={e => {setEmail(e.target.value); setAlert({msg: '', success: false});}}/>
            <div className="invalid-feedback"></div>
          </div>
          <div className="col-md-12 mb-5">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" onChange={e => {setPassword(e.target.value); setAlert({msg: '', success: false});}}/>
            <div className="invalid-feedback"></div>
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
