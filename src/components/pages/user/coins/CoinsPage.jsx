import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  RadioGroup,
  Tab,
} from '@headlessui/react';
import {
  CheckCircle,
  Coin,
  Exclamation,
} from '../../../../../public/icons/Svg';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { planThunk } from '../../../../store/slices/plan.slice';
import apiConfig from '../../../../utils/apiConfig';
import axios from 'axios';
import { PrimaryButton } from '../../../elements/PrimaryButton';
import { Card } from '../../../elements/Card';
import { setLoad } from '../../../../store/slices/loader.slice';
import currencySymbol from '../../../../utils/currencySymbol';
import { PaymentsTimeline } from '../payments/partials/PaymentsTimeline';
import web3Config from '../../../../utils/web3Config';
import Web3 from 'web3';
import amountFormat from '../../../../utils/amountFormat';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { accountThunk } from '../../../../store/slices/account.slice';
import { publicThunk } from '../../../../store/slices/public.slice';
import appError from '../../../../utils/appError';
import { discount } from '../../../../utils/percent.util';
import { NoPlans } from './partials/NoPlans';
import { useTranslation } from 'react-i18next';
import { GiftCardForm } from './partials/GiftCardForm';

export const CoinsPage = () => { 
  
  const [selectedPlan, setSelectedPlan] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [giftcardModal, setGiftcardModal] = useState(false);

  const { env } = useParams()

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const plans = useSelector( (state) => state.plans.methods);
  const publicData = useSelector( (state) => state.publicData);

  const checkNetwork = async () => {

    const mode = selectedMethod.mode ? 'mainnet' : 'testnet'
    const networkList = await window.ethereum.request({ method: 'eth_chainId' });
    const networkExists = networkList.includes(web3Config[mode].networkData[0].chainId);

    if (!networkExists) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: web3Config[mode].networkData,
      });
    }
  }

  const cryptoWebhook = async (transactionId, validate = false) => {

    dispatch(setLoad(false));

    const url = `${apiConfig().endpoint}/webhook/crypto`;

    const data = {
      methodId: selectedPlan.planMethodId, 
      planId: selectedPlan.id, 
      transactionId,
      validate
    }

    await axios
      .post(url, data, apiConfig().axios)
      .catch((err) => appError(err));

  }

  const handleCrypto = async (params) => {

    dispatch(setLoad(false));

    if (window.ethereum) {

      const web3 = new Web3(window.ethereum);

      const reciver = web3Config.receiver
      const contract = web3Config.token.contract
      const ABI = web3Config.token.ABI
      const amount = params.price - params.price * Number(`0.${selectedMethod.coins.discount}`)
      const total = web3.utils.toWei(amount, 'ether')
      
      const gate = new web3.eth.Contract(ABI, contract);
      const data = gate.methods.transfer(reciver, total).encodeABI();
      const from = window.ethereum.selectedAddress;

      const tx = { from, to: contract, data }

      await window.ethereum.enable();
      await checkNetwork()

      try {
        await web3.eth.sendTransaction(tx)
          .on("transactionHash", async (hash) => {
            await cryptoWebhook(hash)
          })
          .on("receipt", async (res) => {
            await cryptoWebhook(res.transactionHash, true).then(() => {
              dispatch(accountThunk())
              Swal.fire({
                toast: true,
                position: 'bottom-right',
                icon: 'success',
                text: `Transaction processed`,
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
              })
            })
          })
      } catch (err) {
        Swal.fire({
          toast: true,
          position: 'bottom-right',
          icon: 'error',
          text: err.data ? err.data.message : err.message,
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    }
    else {
      Swal.fire({
        toast: true,
        position: 'bottom-right',
        icon: 'error',
        text: 'Metamask is required',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
    }

    dispatch(setLoad(true));
  }

  const handleCheckout = async (data) => {
  
    dispatch(setLoad(false));

    const url = `${apiConfig().endpoint}/plans/buy`;

    await axios
      .post(url, data, apiConfig().axios)
      .then((res) => (window.location.href = res.data.url))
      .catch((err) => appError(err));
  }

  const handleBuyPlan = () => {

    const method = selectedMethod.name.toLowerCase()

    const data = {
      method: selectedPlan.planMethodId,
      plan: selectedPlan.id,
    };

    if(method === 'stripe' || method === 'paypal'){
      handleCheckout(data)
    }

    if(method === 'crypto'){
      handleCrypto(selectedPlan)
    }

    if(method === 'giftcard'){
      setGiftcardModal(true)
    }
  };

  const checkEnv = (env) => {

    if(env === "cancel") {
      Swal.fire({
        toast: true,
        position: 'bottom-right',
        icon: 'error',
        text: `Transaction cancelled`,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
    }
    if(env === "success") {
      Swal.fire({
        toast: true,
        position: 'bottom-right',
        icon: 'success',
        text: `Transaction successfully`,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
    }
  }

  useEffect(() => {
    dispatch(planThunk());
  }, []);

  useEffect(() => {
    dispatch(publicThunk());
  }, []);

  useEffect(() => {
    if(env) checkEnv(env)
  }, [])
  
  useEffect(() => {
    if (plans && selectedPlan && selectedPlan.planMethodId) {
      const method = plans.find(method => method.id === selectedPlan.planMethodId);
      setSelectedMethod(method || null);
    }
  }, [selectedPlan, plans]);
  
  return (
    <div className="p-4 h-full">
      <div className="grid grid-cols-4 gap-4 flex-grow h-full">
        <div className="col-span-4 xl:col-span-3 flex flex-col gap-4">
          <PaymentsTimeline />
          <GiftCardForm modal={giftcardModal} setModal={setGiftcardModal} data={selectedPlan} method={selectedMethod} />
          <Card className="flex-grow">
            <div className="mx-auto w-full flex flex-col h-full gap-4 justify-between">
              <div className="flex flex-col h-full gap-4">
                <Tab.Group>
                  <Tab.List className="grid grid-cols-1 md:flex gap-4 justify-between">
                    {plans?.map((method) => (
                      <Tab
                        key={method.id}
                        onChange={({ selected }) =>
                          console.log(selected)
                        }
                        className={({ selected }) =>
                          `w-full rounded-lg py-2.5 text-sm font-medium leading-5 dark:text-white flex gap-2 items-center justify-center
                            hover:bg-custom-light-700 dark:hover:bg-custom-dark-700 border border-black/10 dark:border-black
                            ${
                              selected
                                ? 'dark:bg-custom-dark-700 bg-custom-light-700'
                                : 'dark:bg-custom-dark-600 bg-custom-light-600'
                            }`
                        }
                      >
                        <span className="text-lg">{method.name}</span>
                        {method.coins.discount > 0 && 
                          <span className="p-1 rounded-md text-xs bg-red-600 border border-red-700">
                            {method.coins.discount}% OFF
                          </span>
                        }
                        {method.coins.bonus > 0 && 
                          <span className="p-1 rounded-md text-xs bg-green-600 border border-green-700">
                            {method.coins.bonus}% BONUS
                          </span>
                        }
                      </Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panels className="h-full">
                    { plans?.length > 0 ?
                        plans?.map((method) => (
                          <Tab.Panel key={method.id} className="h-full">
                            <RadioGroup value={selectedPlan} onChange={setSelectedPlan} className="h-full">
                              { method.plans.length > 0 ?
                                <div className="grid grid-cols-3 gap-4" >
                                  {
                                    method.plans.map(
                                      (plan) => (
                                        <RadioGroup.Option
                                          key={plan.id}
                                          value={plan}
                                          className={({ active, checked }) =>
                                            `${active ? '' : ''}
                                            ${checked
                                              ? 'dark:bg-custom-dark-700 bg-custom-light-700'
                                              : 'dark:bg-custom-dark-600 bg-custom-light-600'
                                            }
                                            col-span-4 lg:col-span-1 relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md 
                                            focus:outline-none border border-black/10 dark:border-black overflow-hidden`
                                          }
                                        >
                                          {({
                                            active,
                                            checked,
                                          }) => (
                                            <>
                                              <div className="flex w-full items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                  <div className="shrink-0 text-white">
                                                    <Coin color="#FFD700" size={60}/>
                                                  </div>
                                                  <div className="text-sm">
                                                    <RadioGroup.Label
                                                      as="p"
                                                      className={`font-medium text-2xl flex flex-col ${
                                                        checked
                                                          ? 'text-black dark:text-white'
                                                          : 'text-black dark:text-white/50'
                                                      }`}
                                                    >
                                                      { method.coins.discount > 0 &&
                                                        <span className={method.coins.discount > 0 && 'line-through text-red-500 text-sm'}>
                                                          {`${amountFormat(plan.price)} ${currencySymbol[method.currency]}`}
                                                        </span>
                                                      }
                                                      <span>
                                                        {`${discount(plan.price, method.coins.discount)} ${currencySymbol[method.currency]}`}
                                                      </span>
                                                    </RadioGroup.Label>
                                                    <RadioGroup.Description
                                                      as="span"
                                                      className={`flex gap-1 ${
                                                        checked
                                                          ? 'text-green-700 dark:text-green-300'
                                                          : 'text-green-600'
                                                      }`}
                                                    >
                                                      <span>
                                                        {plan.amount}
                                                      </span>
                                                      {method.coins.bonus > 0 && 
                                                        <span>
                                                          + {plan.amount * Number( `0.${method.coins.bonus}`)}
                                                        </span>
                                                      }
                                                      <span>
                                                        {publicData?.web_general?.name} Coins
                                                      </span>
                                                    </RadioGroup.Description>
                                                    <RadioGroup.Description
                                                      as="span"
                                                      className={`flex gap-1 ${
                                                        checked
                                                          ? 'text-cyan-700 dark:text-cyan-300'
                                                          : 'text-cyan-600'
                                                      }`}
                                                    >
                                                      <span>
                                                        {plan.price} Gems
                                                      </span>
                                                    </RadioGroup.Description>
                                                  </div>
                                                </div>
                                                {checked && (
                                                  <div className="shrink-0 text-white">
                                                    <CheckCircle color="green" />
                                                  </div>
                                                )}
                                              </div>
                                            </>
                                          )}
                                        </RadioGroup.Option>
                                      ),
                                    )
                                  }
                                </div> : <NoPlans /> 
                              }
                            </RadioGroup>
                          </Tab.Panel>
                        )) : <NoPlans /> 
                    }
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>          
          </Card>
        </div>
        <Card className="col-span-4 xl:col-span-1 flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-4 items-center">
            <Coin color="#FFD700" size={200} />
            {!selectedPlan ? (
              <span className="text-xl">
                {t("Please select an option")}
              </span>
            ) : (
              <>
                <Card className="flex flex-col w-full gap-2">
                  <div className="flex gap-4 justify-between">
                    <span className="font-bold">
                      {t("Method")}:
                    </span>
                    <span className="font-light">
                      {selectedMethod?.name}
                    </span>
                  </div>
                  <div className="flex gap-4 justify-between">
                    <span className="font-bold">
                      {t("Price")}:
                    </span>
                    <span className="font-light">
                      {amountFormat(selectedPlan?.price)}{' '}
                      {currencySymbol[selectedMethod?.currency]}
                    </span>
                  </div>
                  <div className="flex gap-4 justify-between">
                    <span className="font-bold">
                      {t("Discount")}: ({selectedMethod?.coins.discount}%)
                    </span>
                    <span className="font-light">
                      -
                      {amountFormat(selectedPlan?.price * Number(`0.${selectedMethod?.coins.discount}`))}{' '}
                      {currencySymbol[selectedMethod?.currency]}
                    </span>
                  </div>
                  <div className="flex gap-4 justify-between border-t border-black dark:border-white pt-2">
                    <span className="font-bold">
                      {t("Total")}:
                    </span>
                    <span className="font-light">
                      {amountFormat(selectedPlan?.price - selectedPlan?.price * Number(`0.${selectedMethod?.coins.discount}`))}{' '}
                      {currencySymbol[selectedMethod?.currency]}
                    </span>
                  </div>
                </Card>
                <Card className="flex flex-col w-full gap-2">
                  <div className="flex gap-4 justify-between">
                    <span className="font-bold">
                      {t("Coins")}:
                    </span>
                    <span className="font-light">
                      {selectedPlan?.amount}
                    </span>
                  </div>
                  <div className="flex gap-4 justify-between">
                    <span className="font-bold">
                      {t("Bonus")}: (
                      {selectedMethod?.coins.bonus}
                      %)
                    </span>
                    <span className="font-light">
                      +
                      {selectedPlan?.amount *
                        Number(
                          `0.${selectedMethod?.coins.bonus}`,
                        )}
                    </span>
                  </div>
                  <div className="flex gap-4 justify-between border-t border-black dark:border-white pt-2">
                    <span className="font-bold">
                      {t("Total")}:
                    </span>
                    <span className="font-light">
                      { selectedPlan?.amount +
                        selectedPlan?.amount *
                          Number(
                            `0.${selectedMethod?.coins.bonus}`,
                          )}
                    </span>
                  </div>
                </Card>
              </>
            )}
          </div>
          <div className="flex flex-col gap-4">
            { selectedMethod ?
                selectedMethod.name.toLowerCase() === 'paypal' &&
                  <div className="flex items-center gap-2 border border-yellow-500 bg-yellow-400/50 rounded-lg p-4">
                    <Exclamation color="yellow" size="60"/>
                    <p className="text-sm">{t("Payments made by Paypal may take a few minutes to credit the coins.")}</p>
                  </div>
                : null
            }
            {selectedPlan &&
              <PrimaryButton
                onClick={() => handleBuyPlan()}
                className="w-full"
                disabled={!selectedPlan}
                id="purchase_btn"
              >
                {t("Buy coins")}
              </PrimaryButton>
            }          
          </div>
        </Card>
      </div>
    </div>
  );
};
