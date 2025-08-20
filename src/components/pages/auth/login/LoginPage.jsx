import React, { useState } from 'react';
import { PreAuthLayout } from '../../../layouts/PreAuthLayout';
import { Card } from '../../../elements/Card';
import { LoginForm } from './partials/LoginForm';
import { CodeValidation } from '../register/partials/CodeValidation';
import { Link } from 'react-router-dom';

export const LoginPage = () => {

  const [account, setAccount] = useState(false)

  return (
    <PreAuthLayout>
      <div className="flex flex-col justify-center items-center h-full">
        <Card className="p-6 flex flex-col w-max">
          <Link to="/" className="p-8 flex justify-center">
            <img src="/img/logo-bottom.png" alt="logo" className="max-h-52" style={{ filter: `drop-shadow(0px 1px 2px black)` }} />
          </Link>
          <div className="flex flex-col gap-4 dark:text-white">
            { account ? <CodeValidation account={account} /> : <LoginForm setAccount={setAccount} /> }
          </div>
        </Card>
      </div>
    </PreAuthLayout>
  );
};
