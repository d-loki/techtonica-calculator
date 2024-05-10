import React, { FC, useState } from 'react';
import useCraftStore from '@/stores/craft_store';
import { BookX, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ItemProps = {
    recipe: string;
    handleRemoveClick: ( recipe: string ) => void;
};

const Item: FC<ItemProps> = ( { recipe, handleRemoveClick } ) => {
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


const BlacklistModal = () => {
    const blacklistedRecipes      = useCraftStore.getState().blacklistedRecipes;
    const removeBlacklistedRecipe = useCraftStore.getState().removeBlacklistedRecipe;
    const [ recipes, setRecipes ] = useState<string[]>( blacklistedRecipes );

    const handleRemoveClick = ( recipe: string ) => {
        removeBlacklistedRecipe( recipe );
        setRecipes( ( recipes ) => recipes.filter( ( r ) => r !== recipe ) );
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon" variant="outline"><BookX className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Blacklist recipes</DialogTitle>
                </DialogHeader>
                <div className="flex flex-wrap p-4">
                    {
                        recipes.map( ( recipe ) => (
                            <Item key={ recipe } recipe={ recipe } handleRemoveClick={ handleRemoveClick } />
                        ) )
                    }
                </div>
            </DialogContent>
        </Dialog>

    );
};

export default BlacklistModal;
