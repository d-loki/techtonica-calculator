import React, { ChangeEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import SelectItemWithImage from '@/components/Global/SelectItemWithImage';
import { Input } from '@/components/ui/input';
import useCraftStore from '@/stores/craft_store';
import BlacklistModal from '@/components/Global/BlacklistModal';

function getAllItems(): { id: string, name: string }[] {
    return require( '../../data/v3/dist/items.json' );
}

const Header = () => {
    const setCalculType = useCraftStore( ( state ) => state.setCalculType );
    const setItem       = useCraftStore( ( state ) => state.setItem );

    const quantityFactories    = useCraftStore( ( state ) => state.quantityFactories );
    const setQuantityFactories = useCraftStore( ( state ) => state.setQuantityFactories );

    const itemsPerMinute    = useCraftStore( ( state ) => state.itemsPerMinute );
    const setItemsPerMinute = useCraftStore( ( state ) => state.setItemsPerMinute );

    function onItemChange( value: string ) {
        setItem( value );
    }

    // TODO: Quand on change le nombre de factories, on doit recalculer le nombre d'items par minute
    function onQuantityFactoriesChange( event: ChangeEvent<HTMLInputElement> ) {
        setQuantityFactories( Number( event.target.value ) );
        setCalculType( 'quantity_factories' );
    }

    // TODO: Quand on change le nombre d'items par minute, on doit recalculer le nombre de factories
    function onItemsPerMinuteChange( event: ChangeEvent<HTMLInputElement> ) {
        setItemsPerMinute( Number( event.target.value ) );
        setCalculType( 'items_per_minute' );
    }

    return (
        <header className="sticky top-0 z-10 flex h-[96px] items-center justify-between gap-1 border-b bg-background px-4">
            <div className="flex gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="item">Item</Label>
                    <Select onValueChange={ onItemChange }>
                        <SelectTrigger id="item" className="items-start [&_[data-description]]:hidden">
                            <SelectValue placeholder="Select an item..." />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                getAllItems().map( ( item ) => (
                                    <SelectItemWithImage key={ item.id } id={ item.id } name={ item.name } />
                                ) )
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="quantity_factories">Factories</Label>
                    <Input defaultValue={ quantityFactories }
                           id="quantity_factories"
                           type="number"
                           onChange={ onQuantityFactoriesChange } />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="items_per_minute">Items/minute</Label>
                    <Input defaultValue={ itemsPerMinute }
                           id="items_per_minute"
                           type="number"
                           placeholder="10"
                           onChange={ onItemsPerMinuteChange } />
                </div>
            </div>
            <BlacklistModal />
        </header>
    );
};

export default Header;
