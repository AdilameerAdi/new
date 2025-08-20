import React, { useState } from 'react'
import { PreAuthLayout } from '../../../layouts/PreAuthLayout'
import { Card } from '../../../elements/Card'
import { RecoveryCodeValidation } from './partials/RecoveryCodeValidation'
import { RecoveryForm } from './partials/RecoveryForm'
import { Link } from 'react-router-dom'

export const RecoveryPage = () => {

  const [account, setAccount] = useState(false)

  return (
    <PreAuthLayout>
      <div className="flex flex-col justify-center items-center h-full">
        <Card className="p-6 flex flex-col max-w-sm">
          <Link to="/" className="p-8 flex justify-center">
            <img src="/img/logo.png" alt="logo" className="max-h-20" style={{ filter: `drop-shadow(0px 1px 2px black)` }}/>
          </Link>
          <div className="flex flex-col gap-4 dark:text-white">
            { account ? <RecoveryCodeValidation account={account} /> : <RecoveryForm setAccount={setAccount} /> }
          </div>
        </Card>
      </div>
    </PreAuthLayout>
  )
}
