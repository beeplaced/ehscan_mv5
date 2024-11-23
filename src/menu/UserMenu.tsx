import { useState } from 'react';
import '../style/user.css'

const UserMenu: React.FC = () => {

  const [customer] = useState(() => {
      return {
      account: 'EHSCAN',
      location: 'Berlin',
      company: 'ehscan photoanalyze',
      user: 'Eric EHS Expert',
      initial: 'EE',
      email: 'eric@ehscan.com'
    };
  });

  return (
    <>
    <main className="content settings">
          <div className='user-management'>
              <div className='user-tag'>{customer.initial}</div>
              <div className='account-name'>{customer.company}</div>
              <div className='user-name'>{customer.user}</div>
              <div className='user-email'>{customer.email}</div>
            </div>
    </main>
    </>
  );
};

export default UserMenu;
