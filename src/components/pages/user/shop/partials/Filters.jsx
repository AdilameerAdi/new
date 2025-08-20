import selectCompatible from '../../../../../utils/selectCompatible'
import { CustomSelect } from '../../../../elements/CustomSelect'
import { Close, Search, Tag } from '../../../../../../public/icons/Svg'
import { Input } from '../../../../elements/Input'
import { Card } from '../../../../elements/Card'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const Filters = ({ shopCategories, handleSearchChange, handleCategoryChange }) => {

    const { t } = useTranslation();

    return (
        <Card className="flex flex-col gap-4 justify-start">
            <h5 className="text-xl">{t("Filters")}</h5>
            <Input
                icon={<Search />}
                id="search"
                name="search"
                type="search"
                label={t("Search")}
                onChange={handleSearchChange}
                placeholder={t("Type anything")}
            />
            <CustomSelect
                placeholder={t("Select")}
                icon={<Tag />}
                label={t("Categories")}
                name="categories"
                id="categories"
                isMulti={true}
                data={selectCompatible(shopCategories, 'id', 'name',)}
                onChange={handleCategoryChange}
            />
        </Card>
    )
}
