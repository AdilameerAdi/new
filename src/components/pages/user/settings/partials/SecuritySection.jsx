import React, { useState } from 'react'
import { Card } from '../../../../elements/Card'
import { UpdatePasswordForm } from './UpdatePasswordForm';
import { CodePasswordValidation } from './CodePasswordValidation';
import { Lock } from '../../../../../../public/icons/Svg';
import { useTranslation } from 'react-i18next';

export const SecuritySection = () => {

  const [password, setPassword] = useState(false)
  const { t } = useTranslation();

  return (
    <div className="animate__animated animate__fadeIn">
      <Card className="lg:max-w-xl flex flex-col gap-6 overflow-hidden">
        <h3 className="text-xl flex gap-2 items-center"><Lock /> {t("Change password")}</h3>
        { password ? <CodePasswordValidation setPassword={setPassword} password={password} /> : <UpdatePasswordForm setPassword={setPassword} />}
      </Card>
    </div>
  )
}
