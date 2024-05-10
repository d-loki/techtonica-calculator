import React, { FC } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import useCraftStore from '@/stores/craft_store';
import ResultType from '@/type/ResultType';
import ItemImage from '@/components/Global/ItemImage';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
    result: ResultType;
}

const CollapsibleRecipes: FC<Props> = ( { result } ) => {
    const blacklistedRecipes  = useCraftStore( ( state ) => state.blacklistedRecipes );
    const addToBlacklist      = useCraftStore( ( state ) => state.addBlacklistedRecipe );
    const removeFromBlacklist = useCraftStore( ( state ) => state.removeBlacklistedRecipe );


    function isBlacklisted( recipe: string ) {
        return blacklistedRecipes.includes( recipe );
    }

    return (
        <TabsContent value="recipe">
            <div className="flex-col items-center gap-5">
                {
                    result.recipes.map( ( alternative,
                                          index ) => (
                        <div key={ index }>
                            {
                                alternative.inputs.map(
                                    ( input,
                                      index ) => (
                                        <div key={ index } className="flex items-center gap-3 my-5">
                                            <ItemImage size="xs" src={ `/items/${ input }.png` } alt={ input } />
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
                    ) )
                }
            </div>
        </TabsContent>
    );
};

export default CollapsibleRecipes;
