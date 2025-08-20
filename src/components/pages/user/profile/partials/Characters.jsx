import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { charactersThunk } from '../../../../../store/slices/character.slice'
import { Card } from '../../../../elements/Card'
import apiConfig from '../../../../../utils/apiConfig'
import amountFormat from '../../../../../utils/amountFormat'
import reputation from '../../../../../utils/reputation'
import { Female, Male } from '../../../../../../public/icons/Svg'
import { Popover } from '../../../../elements/Popover'
import { useTranslation } from 'react-i18next'

export const Characters = ({ characters = [], className = '' }) => {

    const { t } = useTranslation();
    
    if(characters.length === 0)
        return (
            <Card className="flex flex-col gap-4 items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h1 className="text-2xl">{t("There are no characters")}</h1>
            </Card>
        )

    return (
        <div className="flex flex-col gap-4 font-medium">
            <h1 className="text-2xl">{t("Characters")}</h1>
            <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 ${className}`}>
                {
                    characters.map(character => (
                        <Card>
                            <div key={character.id} className="flex relative transition-all ease-in-out">
                                <div className={`border rounded-full absolute z-20 top-0 
                                    ${ character.gender > 0 ? "bg-pink-500" : "bg-blue-500"}`}
                                    title={ character.gender > 0 ? t("Female") : t("Male")}
                                >
                                    { character.gender > 0 ? <Female /> : <Male />}
                                </div>
                                <img src={`/img/class/${character.class}_${character.gender}.png`} alt={character.name} className="border border-zinc-600 rounded-full bg-black z-10 aspect-square"/>
                                <img src={reputation(character.reput)} className="z-10 absolute bottom-0 rounded-full border" title={`${t("Reputation")}: ${amountFormat(Number(character.reput), 'es-ES', 0, 0)}`}/>
                                { character.faction > 0 && <img src={`/img/factions/${character.faction}.png`} alt={character.faction} className="-mt-4 z-20 absolute -right-4" title={character.faction === 1 ? t("Angel") : t("Demon")}/> }
                                <div className="flex flex-col flex-grow">
                                    <div className="flex gap-4 justify-between items-center pl-14 pr-6 py-1 bg-gradient-to-b from-zinc-800 to-black rounded-lg border border-zinc-600 -ml-10 !text-white">
                                        <div className="flex">
                                            <span title={t("Battle Level")}>{character.lvl}</span>
                                            { character.hero_lvl > 0 && <span title={t("Champion Level")}>(+{character.hero_lvl})</span> }
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            { character.biography && 
                                                <Popover 
                                                    button={
                                                        <img src={`${apiConfig().endpoint}/items/icon/1117`} 
                                                            alt={t("Biography" )}
                                                            className="h-6 cursor-pointer" 
                                                            title={t("Biography" )}
                                                        /> 
                                                    }
                                                    title={t("Biography" )}
                                                    text={character.biography.replace(/\x0B/g, ' ')} 
                                                />
                                            }
                                            <span>{character.name}</span>
                                        </div>
                                    </div>
                                    <div className="p-1 pl-12 -ml-10 mr-1 bg-zinc-500 rounded-br-lg flex gap-1 items-center">
                                        <img src={`${apiConfig().endpoint}/items/icon/1046`} alt="gold" className="h-6" />
                                        <div title={t("Gold")} className="rounded-md border border-black bg-gradient-to-b from-yellow-400 via-yellow-600 to-yellow-500 flex flex-grow items-center justify-center">
                                            <span className="text-sm">{amountFormat(Number(character.gold), 'es-ES', 0, 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                }
            </div>            
        </div>

    )
}
