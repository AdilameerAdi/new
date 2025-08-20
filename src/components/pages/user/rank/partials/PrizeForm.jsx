import React from 'react'
import apiConfig from '../../../../../utils/apiConfig'
import { CheckCircle, Coin } from '../../../../../../public/icons/Svg'
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../elements/PrimaryButton';
import { useDispatch } from 'react-redux';
import { setLoad } from '../../../../../store/slices/loader.slice';
import axios from 'axios';
import appError from '../../../../../utils/appError';
import Swal from 'sweetalert2';
import { accountThunk } from '../../../../../store/slices/account.slice';
import { rankThunk } from '../../../../../store/slices/rank.slice';
import { SecondaryButton } from '../../../../elements/SecondaryButton';

export const PrizeForm = ({ data, category, setModal }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleClaim = async () => {

        dispatch(setLoad(false))

        const url = `${apiConfig().endpoint}/ranking/claim`

        await axios.post(url, { characterId: data.character.id, category }, apiConfig().axios)
            .then(res => {
                setModal(false)
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
                dispatch(accountThunk())
                dispatch(rankThunk())
                dispatch(setLoad(true))
            })
    }

    return (
        <div className="flex flex-col gap-4">
            {  
                data.prize.type == 0 ?
                    <div className="flex gap-4 items-center w-full">
                        <img src={`${apiConfig().endpoint}/items/icon/${data.prize.prize.icon}`} className="max-w-[50px]" alt={data.prize.prize.vnum} />
                        <p>{data.prize.prize.desc.uk.replace('[n]', ' ')}</p>
                    </div>
                :
                    <div className="flex gap-4 items-center w-full">
                        <Coin color="#FFD700" size="50"/>
                        <p>{t("For your great effort to reach this rank you can claim this prize, enjoy it!")}</p>
                    </div>
            }
            <hr className="border-t border-black/20 dark:border-black" />
            {
                data.claimed ?
                    <div type="button" className="w-full p-2 rounded-lg border border-green-600 text-green-600 flex justify-center gap-2 font-medium">
                        {t("Reward claimed")}
                        <CheckCircle color="green" />
                    </div>
                :
                    <PrimaryButton type="button" className="w-full" onClick={handleClaim}>
                        {t("Claim reward")}
                    </PrimaryButton>
            }
        </div>
    )
}
