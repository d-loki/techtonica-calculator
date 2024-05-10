import React, { ChangeEvent, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import SelectItemWithImage from '@/components/Global/SelectItemWithImage';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useCraftStore from '@/stores/craft_store';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

function getAllItems(): { id: string, name: string }[] {
    return require( '../../data/v3/dist/items.json' );
}

const BlacklistItem = ( { recipe, handleRemoveClick }: {
    recipe: string,
    handleRemoveClick: ( recipe: string ) => void
} ) => {
    return (
        <div key={ recipe } className="p-2 sm:w-1/2 w-full">
            <div className="bg-gray-100 rounded flex p-4 h-full items-center gap-5">
                <span className="font-medium">{ recipe }</span>
                <Trash className="cursor-pointer ml-auto text-red-500 w-5 h-5 flex-shrink-0 mr-4"
                       onClick={ () => handleRemoveClick( recipe ) } />
            </div>
        </div>
    );

};

const BlacklistItems = () => {
    const blacklistedRecipes      = useCraftStore.getState().blacklistedRecipes;
    const removeBlacklistedRecipe = useCraftStore.getState().removeBlacklistedRecipe;
    const [ recipes, setRecipes ] = useState<string[]>( blacklistedRecipes );

    const handleRemoveClick = ( recipe: string ) => {
        removeBlacklistedRecipe( recipe );
        setRecipes( ( recipes ) => recipes.filter( ( r ) => r !== recipe ) );
    };

    return (
        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2 p-4">
            {
                recipes.map( ( recipe ) => (
                    <BlacklistItem key={ recipe } recipe={ recipe } handleRemoveClick={ handleRemoveClick } />
                ) )
            }
        </div>
    );
};

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
        <header className="sticky top-0 z-10 flex h-[72px] items-center gap-1 border-b bg-background px-4">
            <h1 className="text-xl font-semibold">Calculator</h1>
            <div className="flex gap-4 ml-16">
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
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Open</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Blacklist recipes</DialogTitle>
                        </DialogHeader>
                        <BlacklistItems />
                    </DialogContent>
                </Dialog>

            </div>
        </header>
    );
};

export default Header;
