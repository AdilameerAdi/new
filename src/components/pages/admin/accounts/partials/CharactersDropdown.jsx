import React from 'react'
import { Female, Male } from '../../../../../../public/icons/Svg'
import amountFormat from '../../../../../utils/amountFormat'
import reputation from '../../../../../utils/reputation'
import { Popover } from '../../../../elements/Popover'
import apiConfig from '../../../../../utils/apiConfig'

export const CharactersDropdown = ({ data }) => {
    if(data.length > 0) 
        return (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4 max-h-96 overflow-auto">
                {
                    data.map(character => (
                        <div key={character.id} className="flex relative">
                            <div className={`border rounded-full absolute z-20 top-0 
                                ${ character.gender > 0 ? "bg-pink-500" : "bg-blue-500"}`}
                                title={ character.gender > 0 ? "Female" : "Male"}
                            >
                                { character.gender > 0 ? <Female /> : <Male />}
                            </div>
                            <img src={`/img/class/${character.class}_${character.gender}.png`} alt={character.name} className="border border-zinc-600 rounded-full bg-black z-10 aspect-square"/>
                            <img src={reputation(character.reput)} className="z-10 absolute bottom-0 rounded-full border" title={`Reputation: ${amountFormat(Number(character.reput), 'es-ES', 0, 0)}`}/>
                            { character.faction > 0 && <img src={`/img/factions/${character.faction}.png`} alt={character.faction} className="-mt-4 z-20 absolute -right-4" title={character.faction === 1 ? "Angel" : "Demon"}/> }
                            <div className="flex flex-col flex-grow">
                                <div className="flex gap-4 justify-between items-center pl-14 pr-5 py-1 bg-gradient-to-b from-zinc-800 to-black rounded-lg border border-zinc-600 -ml-10 !text-white">
                                    <div className="flex">
                                        <span title="Battle Level">{character.lvl}</span>
                                        { character.hero_lvl > 0 && <span title="Champion Level">(+{character.hero_lvl})</span> }
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        { character.biography && 
                                            <Popover
                                                button={
                                                    <img src={`${apiConfig().endpoint}/items/icon/1117`} 
                                                        alt="Biography" 
                                                        className="h-6 cursor-pointer" 
                                                        title="Biography" 
                                                    /> 
                                                }
                                                title="Biography" 
                                                text={character.biography.replace(/\x0B/g, ' ')} 
                                            />
                                        }
                                        <span>{character.name}</span>
                                        { character.deletedAt && <span className="text-red-500">[DELETED]</span> }
                                    </div>
                                </div>
                                <div className="p-1 pl-12 -ml-10 mr-1 bg-zinc-500 rounded-br-lg flex gap-1 items-center">
                                    <img src={`${apiConfig().endpoint}/items/icon/1046`} alt="gold" className="h-6" />
                                    <div title="Gold" className="rounded-md border border-black bg-gradient-to-b from-yellow-400 via-yellow-600 to-yellow-500 flex flex-grow items-center justify-center">
                                        <span className="text-sm">{amountFormat(Number(character.gold), 'es-ES', 0, 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    else return (
        <div className="flex justify-center p-4 text-lg font-medium">
            <span className="text-center">No characters</span>
        </div>
    )
}
