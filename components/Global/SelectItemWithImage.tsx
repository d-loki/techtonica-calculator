import React from 'react';
import { SelectItem } from '@/components/ui/select';
import Image from 'next/image';

const SelectItemWithImage = ( { id, name }: { id: string, name: string } ) => {
    return (
        <SelectItem value={ id }>
            <div className="flex items-center gap-2">
                <Image className="rounded"
                       src={ `/items/${ id }.png` } alt={ name } width={ 24 } height={ 24 } />
                <span>{ name }</span>
            </div>
        </SelectItem>
    );
};

export default SelectItemWithImage;
