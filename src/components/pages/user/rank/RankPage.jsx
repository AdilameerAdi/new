import React, { useEffect, useState } from 'react'
import { Table } from '../../../elements/Table';
import { CustomSelect } from '../../../elements/CustomSelect';
import selectCompatible from '../../../../utils/selectCompatible';
import { useDispatch, useSelector } from 'react-redux';
import { Gift, Items, Trophy } from '../../../../../public/icons/Svg';
import reputation from '../../../../utils/reputation';
import amountFormat from '../../../../utils/amountFormat';
import Modal from '../../../elements/Modal';
import { PrizeForm } from './partials/PrizeForm';
import { useTranslation } from 'react-i18next';
import { rankThunk } from '../../../../store/slices/rank.slice';

const GiftComponent = ({ data, category }) => {

    const { t } = useTranslation();
    const [modal, setModal] = useState(false)

    const account = useSelector(state => state.account)

    if(data.character.account_id === account.id)

        return (
            <>
                <button type="button" className="hover:scale-150 transition-all ease-in-out" onClick={() => setModal(!modal)}>
                    <Gift size="20" color="white" />
                </button>
                <Modal
                    open={modal}
                    setOpen={setModal}
                    title={data.prize.type == 0 ? data.prize.prize.name.uk : `${data.prize.prize} ${t("Coins")}`}
                >
                    <PrizeForm data={data} category={category} setModal={setModal}/>
                </Modal>
            </>
        )
}

let data = {

    aot: {
        label: 'AOT',
        img: '/img/rank/arena.png',
        value: {
            banner: '/img/rank/arena.png',
            header: [
                {
                    field: 'rank',
                    name: 'Rank',
                    function: {
                        func: function (param) {

                            let options = {}

                            if(param.position === 1) { options.gift = true; options.icon = <Trophy color="#ffcf00" />; options.className = 'bg-yellow-500/30' }
                            else if(param.position === 2) { options.gift = true; options.icon = <Trophy color="#e3e4e5" />; options.className = 'bg-gray-500/30' }
                            else if(param.position === 3) { options.gift = true; options.icon = <Trophy color="#cd7f32" />; options.className = 'bg-orange-500/30' }
                            else { options.gift = null; options.icon = <Items />; options.className = null }

                            return (
                                <div className={`w-max flex gap-4 items-center px-3 py-1 rounded-full justify-center font-medium text-lg ${options.className}`}>
                                    {options.icon}
                                    <span>{param.position}</span>
                                    { options.gift && <GiftComponent data={param} category={'aot'} /> }
                                </div>
                            )
                        },
                    }
                },
                {
                    field: 'name',
                    name: 'Name',
                },
                {
                    field: 'class',
                    name: 'Class',
                    function: {
                        func: function (param) {
                            if(param) return <img src={`/img/class/${param}.png`} alt={param} className="rounded-full w-8 aspect-square"/>
                        },
                    }
                },
                {
                    field: 'talent_win',
                    name: 'Win',
                },
                {
                    field: 'talent_lose',
                    name: 'Lose',
                },
                {
                    field: 'talent_surrender',
                    name: 'Surrender',
                },
            ],
            items: [],
        },
    },
    act_4: {
        label: 'ACT 4',
        img: '/img/rank/act4.png',
        value: {
            banner: '/img/rank/act4.png',
            header: [
                {
                    field: 'rank',
                    name: 'Rank',
                    function: {
                        func: function (param) {

                            let options = {}

                            if(param.position === 1) { options.gift = true; options.icon = <Trophy color="#ffcf00" />; options.className = 'bg-yellow-500/30' }
                            else if(param.position === 2) { options.gift = true; options.icon = <Trophy color="#e3e4e5" />; options.className = 'bg-gray-500/30' }
                            else if(param.position === 3) { options.gift = true; options.icon = <Trophy color="#cd7f32" />; options.className = 'bg-orange-500/30' }
                            else { options.gift = null; options.icon = <Items />; options.className = null }

                            return (
                                <div className={`w-max flex gap-4 items-center px-3 py-1 rounded-full justify-center font-medium text-lg ${options.className}`}>
                                    {options.icon}
                                    <span>{param.position}</span>
                                    { options.gift && <GiftComponent data={param} category={'act_4'} /> }
                                </div>
                            )
                        },
                    }
                },
                {
                    field: 'name',
                    name: 'Name',
                },
                {
                    field: 'class',
                    name: 'Class',
                    function: {
                        func: function (param) {
                            if(param) return <img src={`/img/class/${param}.png`} alt={param} className="rounded-full w-8 aspect-square"/>
                        },
                    }
                },
                {
                    field: 'act_4_kill',
                    name: 'Kills',
                },
                {
                    field: 'act_4_dead',
                    name: 'Deads',
                },
            ],
            items: [],
        },
    },
    reputation: {
        label: 'Reputation',
        img: '/img/rank/reputation.png',
        value: {
            banner: '/img/rank/reputation.png',
            header: [
                {
                    field: 'rank',
                    name: 'Rank',
                    function: {
                        func: function (param) {

                            let options = {}

                            if(param.position === 1) { options.gift = 2242; options.icon = <Trophy color="#ffcf00" />; options.className = 'bg-yellow-500/30' }
                            else if(param.position === 2) { options.gift = 2242; options.icon = <Trophy color="#e3e4e5" />; options.className = 'bg-gray-500/30' }
                            else if(param.position === 3) { options.gift = 2242; options.icon = <Trophy color="#cd7f32" />; options.className = 'bg-orange-500/30' }
                            else { options.gift = null; options.icon = <Items />; options.className = null }

                            return (
                                <div className={`w-max flex gap-4 items-center px-3 py-1 rounded-full justify-center font-medium text-lg ${options.className}`}>
                                    {options.icon}
                                    <span>{param.position}</span>
                                    { options.gift && <GiftComponent data={param} category={'reputation'} /> }
                                </div>
                            )
                        },
                    }
                },
                {
                    field: 'name',
                    name: 'Name',
                },
                {
                    field: 'class',
                    name: 'Class',
                    function: {
                        func: function (param) {
                            if(param) return <img src={`/img/class/${param}.png`} alt={param} className="rounded-full w-8 aspect-square"/>
                        },
                    }
                },
                {
                    field: 'reputation',
                    name: 'Reputation',
                    function: {
                        func: function (param) {
                            if(param) return <div className="flex gap-2 items-center" title={`Reputation: ${amountFormat(Number(param), 'es-ES', 0, 0)}`}><img src={reputation(param)} alt={param} className="rounded-full w-4 h-4 aspect-square"/>{amountFormat(Number(param), 'es-ES', 0, 0)}</div>
                        },
                    }
                },
            ],
            items: [],
        },
    },

    family: {
        label: 'Family',
        img: '/img/rank/family.png',
        value: {
            banner: '/img/rank/family.png',
            header: [
                {
                    field: 'rank',
                    name: 'Rank',
                    function: {
                        func: function (param) {
                            if(param === 1) return <div className="w-max flex gap-2 items-center px-3 py-1 rounded-full justify-center font-medium text-lg bg-yellow-500/30"><Trophy color="#ffcf00" /><span>{param}</span></div>
                            if(param === 2) return <div className="w-max flex gap-2 items-center px-3 py-1 rounded-full justify-center font-medium text-lg bg-gray-500/30"><Trophy color="#e3e4e5" /><span>{param}</span></div>
                            if(param === 3) return <div className="w-max flex gap-2 items-center px-3 py-1 rounded-full justify-center font-medium text-lg bg-orange-500/30"><Trophy color="#cd7f32" /><span>{param}</span></div>
                            else return <div className="w-max flex gap-2 items-center px-3 py-1 rounded-lg justify-center font-medium text-lg"><Items /><span>{param}</span></div>
                        },
                    }
                },
                {
                    field: 'name',
                    name: 'Name',
                },
                {
                    field: 'faction',
                    name: 'Faction',
                    function: {
                        func: function (param) {
                            if(param) return <img src={`/img/factions/${param}.png`} alt={param} className="rounded-full w-8 aspect-square"/>
                        },
                    }
                },
                {
                    field: 'lvl',
                    name: 'Level',
                },
                {
                    field: 'exp',
                    name: 'Experience',
                    function: {
                        func: function (param) {
                            if(param) return amountFormat(Number(param), 'es-ES', 0, 0)
                        },
                    }
                },
            ],
            items: [],
        },
    },
    /*
    // Falta esto
    raids: {
        label: 'Raids',
        img: '/img/rank/raids.png',
        value: {
            banner: '/img/rank/raids.png',
            header: [],
            items: [],
        },
    },
    rainbow_battle: {
        label: 'Rainbow Battle',
        img: '/img/rank/rainbow_b.png',
        value: {
            banner: '/img/rank/rainbow_b.png',
            header: [],
            items: [],
        },
    },
    */

    // No llevan premio
    level: {
        label: 'Level',
        img: '/img/rank/level.png',
        value: {
            banner: '/img/rank/level.png',
            header: [
                {
                    field: 'rank',
                    name: 'Rank',
                    function: {
                        func: function (param) {

                            let options = {}

                            if(param.position === 1) { options.icon = <Trophy color="#ffcf00" />; options.className = 'bg-yellow-500/30' }
                            else if(param.position === 2) { options.icon = <Trophy color="#e3e4e5" />; options.className = 'bg-gray-500/30' }
                            else if(param.position === 3) { options.icon = <Trophy color="#cd7f32" />; options.className = 'bg-orange-500/30' }
                            else { options.icon = <Items />; options.className = null }

                            return (
                                <div className={`w-max flex gap-4 items-center px-3 py-1 rounded-full justify-center font-medium text-lg ${options.className}`}>
                                    {options.icon}
                                    <span>{param.position}</span>
                                </div>
                            )
                        },
                    }
                },
                {
                    field: 'name',
                    name: 'Name',
                },
                {
                    field: 'class',
                    name: 'Class',
                    function: {
                        func: function (param) {
                            if(param) return <img src={`/img/class/${param}.png`} alt={param} className="rounded-full w-8 aspect-square"/>
                        },
                    }
                },
                {
                    field: 'lvl',
                    name: 'Level',
                },
                {
                    field: 'lvl_xp',
                    name: 'Level XP',
                    function: {
                        func: function (param) {
                            if(param) return amountFormat(Number(param), 'es-ES', 0, 0)
                        },
                    }
                },
            ],
            items: [],
        },
    },
    hero_lvl: {
        label: 'Hero Level',
        img: '/img/rank/herolvl.png',
        value: {
            banner: '/img/rank/herolvl.png',
            header: [
                {
                    field: 'rank',
                    name: 'Rank',
                    function: {
                        func: function (param) {

                            let options = {}

                            if(param.position === 1) { options.icon = <Trophy color="#ffcf00" />; options.className = 'bg-yellow-500/30' }
                            else if(param.position === 2) { options.icon = <Trophy color="#e3e4e5" />; options.className = 'bg-gray-500/30' }
                            else if(param.position === 3) { options.icon = <Trophy color="#cd7f32" />; options.className = 'bg-orange-500/30' }
                            else { options.icon = <Items />; options.className = null }

                            return (
                                <div className={`w-max flex gap-4 items-center px-3 py-1 rounded-full justify-center font-medium text-lg ${options.className}`}>
                                    {options.icon}
                                    <span>{param.position}</span>
                                </div>
                            )
                        },
                    }
                },
                {
                    field: 'name',
                    name: 'Name',
                },
                {
                    field: 'class',
                    name: 'Class',
                    function: {
                        func: function (param) {
                            if(param) return <img src={`/img/class/${param}.png`} alt={param} className="rounded-full w-8 aspect-square"/>
                        },
                    }
                },
                {
                    field: 'hero_lvl',
                    name: 'Hero Level',
                },
                {
                    field: 'hero_lvl_xp',
                    name: 'Hero Level XP',
                    function: {
                        func: function (param) {
                            if(param) return amountFormat(Number(param), 'es-ES', 0, 0)
                        },
                    }
                },
            ],
            items: [],
        },
    },

};



const selectData = (obj) => {
    return Object.keys(obj).map(key => {
        return {
            label: obj[key].label,
            img: obj[key].img,
            value: obj[key].value,
        }; 
    });
}

const Element = ({ category, setCategory }) => {

    return (
        <div className="flex items-start font-normal rounded-md bg-center bg-cover h-[420px] p-2" 
            style={{ backgroundImage: `url(${category?.value?.banner})` }}>
            <div className="grid grid-cols-1 md:grid-cols-5 w-full bg-gradient-to-r from-gray-200 dark:from-custom-dark-600 to-transparent p-2 rounded-md">
                <CustomSelect
                    name="descs"
                    id="descs"
                    defaultValue={category}
                    onChange={(selected) => {
                        setCategory(selected)
                        console.log(selected)
                    }}
                    data={selectCompatible(selectData(data), 'value', 'label', '%img%')}
                />                 
            </div>
        </div>
    )
}

export const RankPage = () => {

    const [category, setCategory] = useState(selectData(data)[0])

    const dispatch = useDispatch()

    const rank = useSelector(state => state.rank)

    const getRanks = async () => {

        data.level.value.items = rank?.level
        data.hero_lvl.value.items = rank?.hero_lvl
        data.reputation.value.items = rank?.reputation
        data.act_4.value.items = rank?.act_4
        data.aot.value.items = rank?.aot
        data.family.value.items = rank?.family

        setCategory(selectData(data)[0])
    }

    useEffect(() => {
        dispatch(rankThunk())
    }, [])

    useEffect(() => {
        getRanks()
    }, [rank])

    return (
        <div className="flex flex-col h-full gap-4 p-4">
            <Table
                header={category?.value?.header} 
                items={category?.value?.items}
                element={
                    <Element 
                        category={category} 
                        setCategory={setCategory}
                    />
                }
            />
        </div>
    )
}