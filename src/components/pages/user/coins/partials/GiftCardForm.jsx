import currencySymbol from '../../../../../utils/currencySymbol';
import Modal from '../../../../elements/Modal'
import { useTranslation } from 'react-i18next';
import React from 'react'
import { Input } from '../../../../elements/Input';
import { useForm } from 'react-hook-form';
import { Card } from '../../../../elements/Card';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { Ticket2 } from '../../../../../../public/icons/Svg';
import { SecondaryButton } from '../../../../elements/SecondaryButton';
import apiConfig from '../../../../../utils/apiConfig';
import axios from 'axios';
import appError from '../../../../../utils/appError';
import Swal from 'sweetalert2';
import { setLoad } from '../../../../../store/slices/loader.slice';

export const GiftCardForm = ({ modal, setModal, data, method }) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const publicData = useSelector(state => state.publicData);
  const { register, handleSubmit, reset, formState: { errors }} = useForm();

  const submit = async (input) => {

    const url = `${apiConfig().endpoint}/payments/giftcard`

    const formData = {
      methodId: data.planMethodId,
      planId: data.id,
      code: input.code,
    };

    if(input.checkbox) {
      dispatch(setLoad(false));
      await axios.post(url, formData, apiConfig().axios)
        .then((res) => {
          setModal(false);
          reset();
          Swal.fire({
            toast: true,
            position: 'bottom-right',
            icon: 'success',
            text: res.data.message,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          });
        })
        .catch(err => {
          appError(err)
          Swal.fire({
            toast: true,
            position: 'bottom-right',
            icon: 'error',
            text: err.response.data.message,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          });
        })
        .finally(() => dispatch(setLoad(true)))
    }
  }

  return (
    <Modal
      open={modal}
      setOpen={setModal}
      title={t('Gift card')}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      screen
    >
      <div className="relative md:max-w-md"> 
        <div className="absolute flex gap-1 right-0 p-4">
          <span className="text-5xl font-bold">{data?.price}</span>
          <span className="text-2xl font-bold">{currencySymbol[method?.currency]}</span>
        </div>
        <img src="/img/eneba_giftcard.png" alt="giftcard" className="w-full rounded-lg" />
      </div>
      <Card className="flex flex-col gap-4 justify-between md:max-w-md text-black dark:text-white">
        <div className="flex flex-col gap-4 text-left">
          <h3 className="text-xl">{t('Instructions')}</h3>
          <span className="text-sm">
            {t('We use Eneba to facilitate credit recharge on our website, please follow the corresponding steps below:')}
          </span>
          <ul className="!text-sm" id="raw_html">
            <li>{t('Access')} <a href="https://www.eneba.com/store/eneba-gift-cards" target="_blank">Eneba</a>, {t('the online store for gift cards and video game codes.')}
            </li>
            <li>
              {t('Select the option corresponding to the value to be recharged')} ({data?.price} {currencySymbol[method?.currency]}).
            </li>
            <li>
              {t('Complete the purchase and you will receive your Gift Card code in your Eneba account.')}
            </li>
            <li>
              {t('Enter the code received in the form and in a few moments an administrator will receive your request, If everything is correct, your balance will be charged directly to your account.')}
            </li>
          </ul>
          <div className="border border-red-600 bg-red-500 p-2 text-xs rounded-lg flex flex-col gap-3 text-white">
            <span className="font-medium">{t('Warning')}</span>
            <p className="text-left">{publicData.web_general.name} {t('is not responsible for the income of giftcards of greater value than the one selected, once the code is sent, returns and/or claims are not accepted, Please double check before submitting your code.')}
            </p>
          </div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
          <Input
            autoComplete="off"
            id="code"
            name="code"
            placeholder={t("Type Eneba code...")}
            required
            icon={<Ticket2 />}
            register={{
              function: register,
              errors: {
                function: errors,
                rules: {
                  required: true,
                },
              },
            }}
          />
          <label className="flex gap-4 items-center text-left" htmlFor="checkbox">
            <input 
              type="checkbox" 
              name="checkbox" 
              id="checkbox" 
              required
              {...register('checkbox', { required: true })}
            />
            <span className="text-xs">
              {t('I have verified the value of this code and accept that once sent there is no return.')}
            </span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SecondaryButton type="button" onClick={() => setModal(false)}>
              {t('Cancel')}
            </SecondaryButton>
            <PrimaryButton type="submit">
              {t('Send')}
            </PrimaryButton>
          </div>
        </form>
      </Card>
    </Modal>
  )
}
