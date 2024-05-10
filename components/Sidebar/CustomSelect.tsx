import React, { FC } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import SelectItemWithImage from '@/components/Global/SelectItemWithImage';

type Props = {
    id: string;
    label: string;
    value: string;
    onValueChange: ( id: string, value: string ) => void;
    options: { id: string, name: string }[];
};

const CustomSelect: FC<Props> = ( { id, label, value, onValueChange, options } ) => {
    return (
        <div className="grid gap-3">
            <Label htmlFor={ id }>{ label }</Label>
            <Select defaultValue={ value } onValueChange={ ( value ) => onValueChange( id, value ) }>
                <SelectTrigger id={ id }
                               className="items-start [&_[data-description]]:hidden">
                    <SelectValue placeholder={ `Select a ${ label.toLowerCase() }` } />
                </SelectTrigger>
                <SelectContent>
                    { options.map( option => (
                        <SelectItemWithImage key={ option.id } id={ option.id } name={ option.name } />
                    ) ) }
                </SelectContent>
            </Select>
        </div>
    );
};

export default CustomSelect;
