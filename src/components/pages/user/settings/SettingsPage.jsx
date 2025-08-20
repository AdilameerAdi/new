import { useState } from 'react'

import { Menu } from './partials/Menu'
import { GeneralSection } from './partials/GeneralSection'
import { SecuritySection } from './partials/SecuritySection'

export const SettingsPage = () => {

    const [option, setOption] = useState(1)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
            <Menu option={option} setOption={setOption} />
            <div className="lg:col-span-4">
                { option === 1 && <GeneralSection /> }
                { option === 2 && <SecuritySection /> } 
            </div>
        </div>
    )
}
