import { useEffect, useState } from "react";
import moment from "moment";
import axios from '../utilities/axios'

function Invoice() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios
      .get('/user/invoice')
      .then(response => {
        setInvoices( response.data.invoices )
      })
      .catch(err => {

      })
  }, []);

  return (
    <div className="invoice">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>File</th>
            <th>Create Date</th>
          </tr>
        </thead>
        <tbody>
          {
            invoices.map((invoice: any, index: number) => (
              <tr key={index}>
                <td><a href="#" target="_blank">{ invoice.file }</a></td>
                <td>{ moment(invoice.createdAt).format('YYYY-MM-DD HH:mm:ss') }</td>
              </tr>
            ))
          }
          <tr></tr>
        </tbody>
      </table>
    </div>
  );
}

export default Invoice;
