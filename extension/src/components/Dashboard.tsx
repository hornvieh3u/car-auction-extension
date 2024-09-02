import { useEffect, useState } from "react";
import moment from "moment";
import axios from '../utilities/axios'

function Dashboard() {
  const [activites, setActivites] = useState([]);

  useEffect(() => {
    axios
      .get('/user/activity')
      .then(response => {
        setActivites( response.data.activities )
      })
      .catch(err => {

      })
  }, []);

  return (
    <div className="dashboard">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Bid Price</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {
            activites.map((activity: any, index: number) => (
              <tr key={index}>
                <td>{ activity.name }</td>
                <td>{ activity.type }</td>
                <td>{ activity.bid_price }</td>
                <td>{ moment(activity.createdAt).format('YYYY-MM-DD HH:mm:ss') }</td>
              </tr>
            ))
          }
          <tr></tr>
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
