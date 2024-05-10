'use client';

import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useCraftStore from '@/stores/craft_store';
import { ArrowRight, ChevronDown, Eye, EyeOff, Trash } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Sidebar from '@/components/Sidebar/Sidebar';
import SelectItemWithImage from '@/components/Global/SelectItemWithImage';
import calculate from '@/lib/calculator';

export type CraftType = {
    id: string;
    output: string;
    quantity: number;
    inputs: { item: string, quantity: number }[];
    base_time: number;
    produced_in: string;
}

export type ThreshType = {
    id: string;
    input: string;
    base_time: number;
    outputs: { item: string, quantity: number }[];

}

export type ResultType = {
    id: string;
    output: string;
    items_per_minute: number;
    belts: number;
    quantity_factories: number;
    produced_in: string;
    recipes: AlternativeRecipe[];
    inputs: { item: string, quantity: number }[];
}

export type AlternativeRecipe = {
    id: string;
    inputs: string[];
}

function getAllItems(): { id: string, name: string }[] {
    return require( '../data/v3/dist/items.json' );
}


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

export default function Home() {
    const [ currentItem, setCurrentItem ]             = useState<string | null>( null );
    const [ quantityFactories, setQuantityFactories ] = useState<number>( 1 );
    const [ itemsPerMinute, setItemsPerMinute ]       = useState<number>( 5 );
    const results                                     = useCraftStore( ( state ) => state.results );
    const conveyorBelt                                = useCraftStore( ( state ) => state.conveyorBelt );
    const drill                                       = useCraftStore( ( state ) => state.drill );
    const smelter                                     = useCraftStore( ( state ) => state.smelter );
    const assembler                                   = useCraftStore( ( state ) => state.assembler );
    const thresher                                    = useCraftStore( ( state ) => state.thresher );

    const setItem = useCraftStore( ( state ) => state.setItem );

    const blacklistedRecipesInStore                     = useCraftStore.getState().blacklistedRecipes;
    const [ blacklistedRecipes, setBlacklistedRecipes ] = useState<string[]>( blacklistedRecipesInStore );


    function onItemChange( id: string ) {
        setCurrentItem( id );
        setItem( id );
    }

    function onQuantityFactoriesChange( event: ChangeEvent<HTMLInputElement> ) {
        setQuantityFactories( Number( event.target.value ) );
    }

    function onItemsPerMinuteChange( event: ChangeEvent<HTMLInputElement> ) {
        setItemsPerMinute( Number( event.target.value ) );
    }

    useEffect( () => {
        console.log( '%c IN USE EFFECT item', 'background: #B5D0FF; color: #000000' );
        calculate();
    }, [ currentItem ] );

    useEffect( () => {
        console.log( '%c IN USE EFFECT itemsPerMinute', 'background: #B5D0FF; color: #000000' );
        calculate();
    }, [ itemsPerMinute ] );

    useEffect( () => {
        console.log( '%c IN USE EFFECT quantityFactories', 'background: #B5D0FF; color: #000000' );
        calculate();
    }, [ quantityFactories ] );


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
                            <DialogTrigger>Open</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Blacklist recipes</DialogTitle>
                                </DialogHeader>
                                <BlacklistItems />
                            </DialogContent>
                        </Dialog>

                    </div>
                </header>
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


