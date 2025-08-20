import React, { useState } from 'react'
import { Card } from '../../../../elements/Card'
import { UpdateEmailForm } from './UpdateEmailForm';
import { CodeEmailValidation } from './CodeEmailValidation';
import { Envelope } from '../../../../../../public/icons/Svg';
import { useTranslation } from 'react-i18next';

export const GeneralSection = () => {

  const [email, setEmail] = useState(false)
  const { t } = useTranslation();

  return (
    <div className="animate__animated animate__fadeIn">
      <Card className="lg:max-w-xl flex flex-col gap-6 overflow-hidden">
        <h3 className="text-xl flex gap-2 items-center"><Envelope /> {t("Change email")}</h3>
        { email ? <CodeEmailValidation setEmail={setEmail} email={email} /> : <UpdateEmailForm setEmail={setEmail} />}
      </Card>
    </div>
  )
}
