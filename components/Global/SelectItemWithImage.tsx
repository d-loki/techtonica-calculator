import React from 'react';
import { SelectItem } from '@/components/ui/select';
import ItemImage from '@/components/Global/ItemImage';

const SelectItemWithImage = ( { id, name }: { id: string, name: string } ) => {
    return (
        <SelectItem value={ id }>
            <div className="flex items-center gap-2">
                <ItemImage size="xs" src={ `/items/${ id }.png` } alt={ name } />
                <span>{ name }</span>
            </div>
        </SelectItem>
    );
};

export default SelectItemWithImage;
