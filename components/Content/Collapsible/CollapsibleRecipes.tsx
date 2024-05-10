import React, { FC } from 'react';
import Image from 'next/image';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import useCraftStore from '@/stores/craft_store';
import ResultType from '@/type/ResultType';

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
                            <p>Alternative { index + 1 }</p>
                            {
                                alternative.inputs.map(
                                    ( input,
                                      index ) => (
                                        <div key={ index }
                                             className="flex items-center gap-5 space-y-2">
                                            <Image
                                                className="rounded"
                                                src={ `/items/${ input }.png` }
                                                alt={ input }
                                                width={ 24 }
                                                height={ 24 } />
                                            <ArrowRight />
                                            <Image
                                                className="rounded"
                                                src={ `/items/${ result.output }.png` }
                                                alt={ result.output }
                                                width={ 24 }
                                                height={ 24 } />
                                            {
                                                isBlacklisted(
                                                    alternative.id ) ? (
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={ () => removeFromBlacklist(
                                                            alternative.id ) }>
                                                        <EyeOff
                                                            className="size-4" /></Button>
                                                ) : (
                                                    <Button
                                                        onClick={ () => addToBlacklist(
                                                            alternative.id ) }>
                                                        <Eye
                                                            className="size-4" />
                                                    </Button>

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
