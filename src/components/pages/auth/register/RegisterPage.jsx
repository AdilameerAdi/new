import React, { useState } from 'react';
import { PreAuthLayout } from '../../../layouts/PreAuthLayout';
import { Card } from '../../../elements/Card';
import { RegisterForm } from './partials/RegisterForm';
import { CodeValidation } from './partials/CodeValidation';
import { Link, useLocation } from 'react-router-dom';

export const RegisterPage = () => {

  const [account, setAccount] = useState(false)

  const location = useLocation();
  const data = location.state && location.state.data;

  return (
    <PreAuthLayout>
      <div className="flex flex-col justify-center items-center h-full">
        <Card className="p-6 flex flex-col max-w-md">
          <Link to="/" className="p-8 flex justify-center">
            <img src="/img/logo-bottom.png" alt="logo" className="max-h-52" style={{ filter: `drop-shadow(0px 1px 2px black)` }} />
          </Link>
          <div className="flex flex-col gap-4 dark:text-white">
            { account ? <CodeValidation account={account} /> : <RegisterForm setAccount={setAccount} firebase={data}/> }
          </div>
        </Card>
      </div>
    </PreAuthLayout>
  );
};
