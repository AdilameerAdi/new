import React, { useEffect } from 'react'
import { Card } from '../../../../elements/Card'
import { useDispatch, useSelector } from 'react-redux'
import { rankThunk } from '../../../../../store/slices/rank.slice'
import { useState } from 'react'
import { Trophy } from '../../../../../../public/icons/Svg'
import cutString from '../../../../../utils/cutString'
import { NavLink } from '../../../../elements/user/NavLink'
import { Link } from 'react-router-dom'

const options = [
    {
        option: 0,
        title: 'ACT 4'
    },
    {
        option: 1,
        title: 'AOT'
    },
    {
        option: 2,
        title: 'Family'
    },
    {
        option: 3,
        title: 'Hero Level'
    },
    {
        option: 4,
        title: 'Level'
    },
    {
        option: 5,
        title: 'Reputation'
    },
]

const RankingSidebar = ({ option, setOption }) => {
    return (
        <aside className="flex flex-col bg-custom-light-500 dark:bg-custom-dark-500">
            {
                options.map(item => (
                    <button key={item.option} onClick={() => setOption(item.option)}
                        className={`p-2 font-medium border-transparent -m-[1px] z-10 transition-all duration-300 ease-in-out
                            ${option === item.option ? 'border-y bg-custom-light-600 dark:bg-custom-dark-600 !border-black/20 dark:!border-black'
                            : 'border hover:bg-custom-light-700 hover:dark:bg-custom-dark-700 hover:z-20 dark:hover:border-black hover:border-black/20'}`
                        }
                    >
                        {item.title}
                    </button>
                ))
            }
        </aside>
    )
}

const Top = ({ data }) => {
    return (
        <div className="flex flex-col col-span-2 p-2 border-l border-black/20 dark:border-black">
            <NavLink as={Link} to="/rank" className="text-center text-lg" >Top Ranking</NavLink>
            <div className="p-4 w-full flex flex-wrap gap-2 justify-around">
                {
                    data?.slice(0, 3).map((item, index) => (
                        <div className="flex flex-col justify-center items-center" title={item.name}>
                            <div className="flex flex-col items-center">
                                <div className={`flex gap-1 items-center`}>
                                    <Trophy color="#ffcf00" />
                                    <span className="font-medium text-lg">
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="bg-[url(/img/deste_3.png)] breath__animate bg-center bg-cover h-24 w-24 flex flex-col justify-center items-center">
                                    <img src={`${ item.class ? `img/class/${item.class}.png` : `img/factions/${item.faction}.png` }`} alt={item.name} className="w-10 h-10"/>
                                </div>
                                <h3 className="text-sm font-medium">{cutString(item.name, 12)}</h3>
                            </div>
                        </div>
                    ))
                }
            </div>            
        </div>
    )
}

export const LatestRanking = ({ rank, className = '' }) => {

    const [option, setOption] = useState(0)

    const data = [
        rank.act_4,
        rank.aot,
        rank.family,
        rank.hero_lvl,
        rank.level,
        rank.reputation
    ]

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(rankThunk())
    }, [])

    return (
        <Card className={`grid grid-cols-3 !p-0 overflow-hidden ${className}`}>
            <RankingSidebar option={option} setOption={setOption} />
            <Top data={data[option]} />
        </Card>
    )
}
