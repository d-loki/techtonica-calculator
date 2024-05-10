import React, { FC } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import useCraftStore from '@/stores/craft_store';
import ResultType from '@/type/ResultType';
import ItemImage from '@/components/Global/ItemImage';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
    result: ResultType;
}

const CollapsibleRecipes: FC<Props> = ( { result } ) => {
    const blacklistedRecipes  = useCraftStore( ( state ) => state.blacklistedRecipes );
    const addToBlacklist      = useCraftStore( ( state ) => state.addBlacklistedRecipe );
    const removeFromBlacklist = useCraftStore( ( state ) => state.removeBlacklistedRecipe );


    // TODO: Faire en sorte de ne pas pouvoir blacklister une recette si il n'y a pas de recette alternative

    function isBlacklisted( recipe: string ) {
        return blacklistedRecipes.includes( recipe );
    }

    return (
        <TabsContent value="recipe">
            <div className="flex-col items-center gap-5">
                {
                    result.recipes.map( ( alternative, index ) => (
                        <div key={ index } className="flex items-center gap-2 my-5">
                            <div className="flex gap-2">
                                {
                                    alternative.inputs.map( ( input, index ) => (
                                        <ItemImage key={ `${ index }-${ input }` }
                                                   size="xs"
                                                   src={ `/items/${ input }.png` }
                                                   alt={ input } />
                                    ) )
                                }
                            </div>
                            <ArrowRight className="h-4 w-4" />
                            <ItemImage size="xs"
                                       src={ `/items/${ result.output }.png` }
                                       alt={ result.output } />
                            {
                                isBlacklisted(
                                    alternative.id ) ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <EyeOff
                                                    onClick={ () => removeFromBlacklist(
                                                        alternative.id ) }
                                                    className="size-5 cursor-pointer" />
                                            </TooltipTrigger>
                                            <TooltipContent className="mb-5">
                                                <p>Remove from blacklist</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                ) : (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Eye
                                                    onClick={ () => addToBlacklist( alternative.id ) }
                                                    className="size-5 cursor-pointer" />
                                            </TooltipTrigger>
                                            <TooltipContent className="mb-5">
                                                <p>Add to blacklist</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                )
                            }
                        </div>
                    ) )
                }
            </div>
        </TabsContent>
    );
};

export default CollapsibleRecipes;
