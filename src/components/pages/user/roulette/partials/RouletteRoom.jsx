import React, { useEffect, useState } from 'react'
import { Card as UserCard } from '../../../../elements/Card'
import { Card as AdminCard } from '../../../../elements/admin/Card';
import io from 'socket.io-client';
import cutString from '../../../../../utils/cutString';
import apiConfig from '../../../../../utils/apiConfig';
import { useTranslation } from 'react-i18next';

export const RouletteRoom = ({ admin = false }) => {

    const { t } = useTranslation();

    const [history, setHistory] = useState([])

    const Card = admin ? AdminCard : UserCard

    useEffect(() => {

        const socket = io(import.meta.env.VITE_API_URL);

        socket.emit('join_room', 'wheel_room');

        socket.on('wheel_room_spin', (data) => setHistory(prevHistory => [...prevHistory, data]));

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <Card className={`flex flex-col gap-4 ${ !admin && 'w-96'}`}>
            <h1 className={`text-xl font-medium border-b pb-4 border-black/20 ${ admin ? 'dark:border-admin-dark-500' : 'dark:border-black'}`}>
                {t("Logs")}
            </h1>
            <div className="flex flex-col gap-2 flex-grow overflow-auto">
                {
                    history.map((item, index) => (
                        <div key={index} 
                            className={`flex gap-2 items-center justify-between text-xs p-1 rounded-full
                            ${item.item.jackpot && 'bg-gradient-to-b from-transparent via-orange-500/30 to-transparent'}`}
                        >
                            <div className="flex items-center gap-2">
                                <img src={`/img/class/${item.character.class}_${item.character.gender}.png`} alt={item.character.name} className="w-5 rounded-full" />
                                <span className="font-medium text-yellow-600">[{item.character.name}]</span>
                                <span className="dark:text-green-400">
                                    { cutString(`WINS: ${item.item.name}`, 25)  } (x{item.item.amount})
                                </span>                                
                            </div>
                            <img src={`${apiConfig().endpoint}/items/icon/${item.item.vnum}`} alt={item.item.vnum} className="w-5 rounded-full" />
                        </div>
                    ))
                }
            </div>
        </Card>
    )
}
