import React from 'react'
import { Card } from '../../../../elements/Card'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

export const RouleteRules = ({ data }) => {

    const { t } = useTranslation();

    return (
        <Card className="flex flex-col gap-4 w-96">
            <h1 className="text-xl font-medium border-b pb-4 border-black/20 dark:border-black">{t("How to play?")}</h1>
            <div className="flex flex-col gap-4">
                <p>
                    {t("To play wheel you need coins in your account. You can buy them in the")} <Link to="/coins" className="underline">{t("coin store")}</Link> {t("or receive them as a gift from other players with the coin sending option.")}
                </p>
                <p>
                    {t("When you have enough coins to play, you must select a character and a jackpot prize and then you can hit the")} <button className="text-xs px-3 rounded-md border border-orange-600 uppercase">{t("Spin")}</button> {t("button to start.")}
                </p>
                <p>
                    {t("The game guarantees you a jackpot in every")} <b className="lowercase">{data.jackpot_spin} {t("Spins")}</b> {t("in case you have not won before, every time you win a jackpot the spin counter will reset to zero and start counting again.")}
                </p>                
            </div>

        </Card>
    )
}
