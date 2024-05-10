'use client';

import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useCraftStore from '@/stores/craft_store';
import { ArrowRight, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/header/Header';
import calculate from '@/lib/calculator';


type FactoryImgProps = {
    produced_in: string | null;
    current_drill: string;
    current_smelter: string;
    current_assembler: string;
    current_thresher: string;
}

const FactoryImg: FC<FactoryImgProps> = ( {
                                              produced_in,
                                              current_drill,
                                              current_smelter,
                                              current_assembler,
                                              current_thresher,
                                          } ) => {
    let factory = '';
    switch ( produced_in ) {
        case 'Mining_Drill':
            factory = current_drill;
            break;
        case 'Smelter':
            factory = current_smelter;
            break;
        case 'Assembler':
            factory = current_assembler;
            break;
        case 'Thresher':
            factory = current_thresher;
            break;
    }

    if ( factory === '' ) {
        return null;
    }

    return ( <Image className="rounded"
                    src={ `/items/${ factory }.png` }
                    alt="Factories"
                    width={ 48 }
                    height={ 48 } /> );

};

export default function Home() {
    const results      = useCraftStore( ( state ) => state.results );
    const conveyorBelt = useCraftStore( ( state ) => state.conveyorBelt );
    const drill        = useCraftStore( ( state ) => state.drill );
    const smelter      = useCraftStore( ( state ) => state.smelter );
    const assembler    = useCraftStore( ( state ) => state.assembler );
    const thresher     = useCraftStore( ( state ) => state.thresher );

    const blacklistedRecipesInStore                     = useCraftStore.getState().blacklistedRecipes;
    const [ blacklistedRecipes, setBlacklistedRecipes ] = useState<string[]>( blacklistedRecipesInStore );

    const item              = useCraftStore( ( state ) => state.item );
    const quantityFactories = useCraftStore( ( state ) => state.quantityFactories );
    const itemsPerMinute    = useCraftStore( ( state ) => state.itemsPerMinute );

    useEffect( () => {
        console.log( '%c IN USE EFFECT', 'background: #B5D0FF; color: #000000' );
        calculate();
    }, [ item, quantityFactories, itemsPerMinute ] );

    function addToBlacklist( recipe: string ) {
        const addBlacklistedRecipe = useCraftStore.getState().addBlacklistedRecipe;
        addBlacklistedRecipe( recipe );
        setBlacklistedRecipes( ( recipes ) => [ ...recipes, recipe ] );
    }

    function removeFromBlacklist( recipe: string ) {
        const removeBlacklistedRecipe = useCraftStore.getState().removeBlacklistedRecipe;
        removeBlacklistedRecipe( recipe );
        setBlacklistedRecipes( ( recipes ) => recipes.filter( ( r ) => r !== recipe ) );
    }

    function isBlacklisted( recipe: string ) {
        console.log( `isBlacklisted ${ recipe } : `, blacklistedRecipes.includes( recipe ) );
        return blacklistedRecipes.includes( recipe );
    }

    return (
        <div className="grid h-screen w-full pl-[56px]">
            <div className="flex flex-col">
                <Header />
                <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-4 lg:grid-cols-5">
                    <Sidebar />
                    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 md:col-span-3 lg:col-span-4">
                        Result
                        <div className="mt-5 relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16"></TableHead>
                                        <TableHead>Items/m</TableHead>
                                        <TableHead>Belts</TableHead>
                                        <TableHead>Factories</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        results && (
                                            results.map( ( result, index ) => (
                                                <Collapsible asChild key={ result.id }>
                                                    <>
                                                        <TableRow>
                                                            <CollapsibleTrigger asChild>
                                                                <TableCell className="group w-16 cursor-pointer bg-blue-100">
                                                                    <ChevronDown className="group-hover:text-blue-500" />
                                                                </TableCell>
                                                            </CollapsibleTrigger>
                                                            <TableCell className="font-medium bg-red-100">
                                                                <div className="flex items-center gap-5">
                                                                    <Image className="rounded"
                                                                           src={ `/items/${ result.output }.png` }
                                                                           alt={ result.output }
                                                                           width={ 48 }
                                                                           height={ 48 } />
                                                                    <span>{ result.items_per_minute.toFixed( 2 ) }</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="bg-green-100">
                                                                <div className="flex items-center gap-5">
                                                                    <div className="flex items-center gap-1">
                                                                        <Image className="rounded"
                                                                               src={ `/items/${ conveyorBelt }.png` }
                                                                               alt="Conveyor Belt"
                                                                               width={ 48 }
                                                                               height={ 48 } />
                                                                        X
                                                                    </div>
                                                                    <span>{ result.belts.toFixed( 2 ) }</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="bg-purple-100">
                                                                <div className="flex items-center gap-5">
                                                                    <div className="flex items-center gap-1">
                                                                        <FactoryImg produced_in={ result.produced_in }
                                                                                    current_drill={ drill }
                                                                                    current_smelter={ smelter }
                                                                                    current_assembler={ assembler }
                                                                                    current_thresher={ thresher } />
                                                                        X
                                                                    </div>
                                                                    <span>{ result.quantity_factories.toFixed( 2 ) }</span>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                        <CollapsibleContent asChild>
                                                            <TableRow>
                                                                <TableCell colSpan={ 4 } className="bg-cyan-50">
                                                                    <Tabs defaultValue="item" className="w-[400px]">
                                                                        <TabsList>
                                                                            <TabsTrigger value="item">Items</TabsTrigger>
                                                                            <TabsTrigger value="recipe">Recipes</TabsTrigger>
                                                                        </TabsList>
                                                                        <TabsContent value="item">
                                                                            {
                                                                                result.inputs.map( ( input, index ) => (
                                                                                    <div key={ index }
                                                                                         className="flex items-center gap-5 space-y-2">
                                                                                        <Image className="rounded"
                                                                                               src={ `/items/${ input.item }.png` }
                                                                                               alt={ input.item }
                                                                                               width={ 24 }
                                                                                               height={ 24 } />
                                                                                        <ArrowRight />
                                                                                        <Image className="rounded"
                                                                                               src={ `/items/${ result.output }.png` }
                                                                                               alt={ result.output }
                                                                                               width={ 24 }
                                                                                               height={ 24 } />
                                                                                    </div>
                                                                                ) )
                                                                            }

                                                                        </TabsContent>
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
                                                                    </Tabs>
                                                                </TableCell>
                                                            </TableRow>
                                                        </CollapsibleContent>
                                                    </>
                                                </Collapsible>
                                            ) )
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}


