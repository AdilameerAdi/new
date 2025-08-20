
import { paymentPrizesThunk } from '../../../../../store/slices/paymentsPrizes.slice'
import { accountThunk } from '../../../../../store/slices/account.slice'
import { SecondaryButton } from '../../../../elements/SecondaryButton'
import selectCompatible from '../../../../../utils/selectCompatible'
import { setLoad } from '../../../../../store/slices/loader.slice'
import { PrimaryButton } from '../../../../elements/PrimaryButton'
import { CustomSelect } from '../../../../elements/CustomSelect'
import { Diamond } from '../../../../../../public/icons/Svg'
import { useDispatch, useSelector } from 'react-redux'
import cutString from '../../../../../utils/cutString'
import apiConfig from '../../../../../utils/apiConfig'
import appError from '../../../../../utils/appError'
import Modal from '../../../../elements/Modal'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'

export const ClaimItem = ({ modal, setModal, item = {} }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { handleSubmit, reset, formState: { errors } } = useForm();
    const [characterId, setCharacterId] = useState(null)
    const account = useSelector(state => state.account)
    const characters = useSelector(state => state.characters)

    const submit = async (data) => {

        if(characterId) {
            dispatch(setLoad(false));

            const url = `${apiConfig().endpoint}/gems/claim/${item.id}`

            let formData = data

            formData.characterId = characterId

            await axios.post(url, formData, apiConfig().axios)
                .then(res => {
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
                    appError(err);
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
                .finally(() => {
                    dispatch(paymentPrizesThunk())
                    dispatch(accountThunk())
                    dispatch(setLoad(true))
                    setModal(false)
                })
        }
        else {
            Swal.fire({
                toast: true,
                position: 'bottom-right',
                icon: 'error',
                text: 'Select character',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            });
        }

    }

    if(item.id)

        return (
            <Modal
                open={modal}
                setOpen={setModal}
                className="flex flex-col gap-4 !pt-0"
                title={
                    <div className="flex flex-wrap gap-4 items-center justify-between relative">
                        <div className="flex gap-1 items-center">
                            <span>{cutString(item.item?.name.uk, 30)}</span>
                            {item.stackeable && <span className="px-2 rounded-md text-white bg-red-500">x{ item.stack }</span> }
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-medium">
                                {item.target}
                            </span>
                            <Diamond color="cyan" size={20} />
                        </div>
                    </div>
                }
            >  
                <div className="flex gap-4 items-center py-3 w-full">
                    <img src={`${apiConfig().endpoint}/items/icon/${item.item?.vnum}`} className="max-w-[50px]" alt={item.item?.vnum} />
                    <p>{item.item?.desc.uk.replace('[n]', ' ')}</p>
                </div>
                {
                !item.claim ?
                 //  item.available ?
                        account?.gems >= item?.target ? 

                            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(submit)}>
                                <CustomSelect
                                    id="characterId"
                                    name="characterId"
                                    label="Character"
                                    values={characterId}
                                    onChange={(selected) => setCharacterId(selected.value)}
                                    data={selectCompatible(characters, 'id', 'name', '/img/class/%class%_%gender%.png')}
                                />          
                                <PrimaryButton type="submit" className="flex gap-4 justify-center items-center w-full">
                                    {t("Claim")}
                                </PrimaryButton>
                            </form>
                            :
                            <SecondaryButton type="button" variant="outline" disabled>
                                {t("Insufficient gems")}
                            </SecondaryButton>
                        : null
                   // : null
                }
            </Modal>
        )
}
