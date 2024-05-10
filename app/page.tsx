'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

type CraftType = {
    id: string;
    output: string;
    quantity: number;
    inputs: { item: string, quantity: number }[];
    base_time: number;
    produced_in: string;
}

type ThreshType = {
    id: string;
    input: string;
    base_time: number;
    outputs: { item: string, quantity: number }[];

}

type ResultType = {
    id: string;
    output: string;
    items_per_minute: number;
    belts: number;
    quantity_factories: number;
    produced_in: string;
    recipes: AlternativeRecipe[];
    inputs: { item: string, quantity: number }[];
}

type AlternativeRecipe = {
    id: string;
    inputs: string[];
}

function getAllItems(): { id: string, name: string }[] {
    return require( '../data/v3/dist/items.json' );
}

function findCraft( id: string ): CraftType[] {
    const blacklistedRecipes = useCraftStore.getState().blacklistedRecipes;
    const crafts             = require( '../data/v3/dist/craft.json' );
    // return crafts.filter( ( craft: any ) => {
    //     const notInBlackList = !blacklistedRecipes.includes( craft.id );
    //     return craft.output === id && notInBlackList;
    // } );

    return crafts.filter( ( craft: any ) => ( craft.output === id ) );
}

function findThresh( id: string ): ThreshType[] {
    const blacklistedRecipes = useCraftStore.getState().blacklistedRecipes;
    const thresh             = require( '../data/v3/dist/thresh.json' );
    // return thresh.filter( ( craft: any ) => {
    //     const notInBlackList = !blacklistedRecipes.includes( craft.id );
    //     const findOuput      = craft.outputs.find( ( output: any ) => output.item === id );
    //     return findOuput && notInBlackList;
    // } );

    return thresh.filter( ( craft: any ) => {
        return craft.outputs.find( ( output: any ) => output.item === id );
    } );
}

function updateResults( output: string,
                        itemsPerMinute: number,
                        belts: number,
                        quantityFactories: number,
                        produced_in: string | null,
                        inputs: { item: string, quantity: number }[],
                        recipes: AlternativeRecipe[],
                        results: ResultType[] ) {
    const existingIndex = results.findIndex( ( result ) => result.output === output );
    if ( existingIndex > -1 ) {
        results[ existingIndex ].items_per_minute += itemsPerMinute;
        results[ existingIndex ].belts += belts;
        results[ existingIndex ].quantity_factories += quantityFactories;
    } else {
        results.push( {
                          id:                 crypto.randomUUID(),
                          output,
                          items_per_minute:   itemsPerMinute,
                          belts,
                          quantity_factories: quantityFactories,
                          produced_in:        produced_in ?? '',
                          recipes,
                          inputs,
                      } );
    }
}

function threeCrafts( id: string, result: any[] = [], itemsPerMinuteNeeded = 1 ): ResultType[] {

    console.log( '%c threeCrafts', 'background: #3DFFC0; color: #000000' );
    const craft = findCraft( id );
    const t     = findThresh( id );

    console.log( `findThresh for ${ id } `, t );
    if ( craft.length === 0 && t.length === 0 ) {
        console.log( `%c NO CRAFT OR THRESH FOR ${ id }`, 'background: #FF000A; color: #000000' );
        return [];
    }

    const itemPerbelt         = useCraftStore.getState().beltCapacity;
    const assemblerEfficiency = useCraftStore.getState().assemblerEfficiency;

    const firstIndexNotBlacklisted = craft.findIndex( ( craft ) => {
        return !useCraftStore.getState().blacklistedRecipes.includes( craft.id );
    } );
    console.log( 'firstIndexNotBlacklisted', firstIndexNotBlacklisted );

    let efficiency = 0;
    switch ( craft[ firstIndexNotBlacklisted ].produced_in ) {
        case 'Mining_Drill':
            efficiency = useCraftStore.getState().drillEfficiency;
            break;
        case 'Smelter':
            console.log( '%c IN SMELTER', 'background: #FF80C7; color: #000000' );
            efficiency = useCraftStore.getState().smelterEfficiency;
            break;
        case 'Assembler':
            efficiency = useCraftStore.getState().assemblerEfficiency;
            break;
        case 'Thresher':
            efficiency = useCraftStore.getState().thresherEfficiency;
            break;
    }

    const itemPerMinutePerFactory = convertBaseTimeToItembyMinute( craft[ firstIndexNotBlacklisted ].base_time ) * craft[ firstIndexNotBlacklisted ].quantity * efficiency;
    const quantityFactories       = itemsPerMinuteNeeded / itemPerMinutePerFactory;


    console.log( `NEED ${ itemsPerMinuteNeeded } ${ id } per minute` );
    console.log( `Item per minute factory ${ itemPerMinutePerFactory }` );
    console.log( `Quantity factories ${ quantityFactories }` );

    if ( craft.length > 0 ) {
        let shortRecipes: AlternativeRecipe[] = [];

        if ( craft.length > 1 ) {
            shortRecipes = craft.map( ( craft ) => {
                return {
                    id:     craft.id,
                    inputs: craft.inputs.map( ( input ) => input.item ),
                };
            } );
        }

        const inputs = craft[ firstIndexNotBlacklisted ].inputs.map( ( input ) => {
            return {
                item:     input.item,
                quantity: input.quantity,
            };
        } );

        updateResults( craft[ firstIndexNotBlacklisted ].output,
                       itemsPerMinuteNeeded,
                       itemsPerMinuteNeeded / itemPerbelt,
                       quantityFactories,
                       craft[ firstIndexNotBlacklisted ].produced_in,
                       inputs,
                       shortRecipes,
                       result );
    }

    for ( const input of craft[ firstIndexNotBlacklisted ].inputs ) {
        console.log( `CRAFT FOR INPUT : ${ input.item }` );
        const inputCraft = findCraft( input.item );
        console.log( `findThresh for input ${ id } `, findThresh( id ) );

        console.log( inputCraft );
        if ( inputCraft.length > 0 ) {

            const firstIndexInputNotBlacklisted = inputCraft.findIndex( ( craft ) => {
                return !useCraftStore.getState().blacklistedRecipes.includes( craft.id );
            } );

            // Si dans les inputs du craft on à le dernier output du dernier craft on stop afin de ne pas avoir de circulaire
            const findCirculare = inputCraft[ firstIndexInputNotBlacklisted ].inputs.find( ( input ) => input.item === craft[ firstIndexNotBlacklisted ].output );

            if ( findCirculare ) {
                console.log( `%c CIRCULAR FOR ${ input.item }`, 'background: #FFB122; color: #000000' );
                let shortRecipes: AlternativeRecipe[] = [];

                if ( inputCraft.length > 1 ) {
                    shortRecipes = inputCraft.map( ( craft ) => {
                        return {
                            id:     craft.id,
                            inputs: craft.inputs.map( ( input ) => input.item ),
                        };
                    } );
                }

                const inputs = inputCraft[ firstIndexInputNotBlacklisted ].inputs.map( ( input ) => {
                    return {
                        item:     input.item,
                        quantity: input.quantity,
                    };
                } );


                updateResults( input.item,
                               itemsPerMinuteNeeded,
                               itemsPerMinuteNeeded / itemPerbelt,
                               0,
                               null,
                               inputs,
                               shortRecipes,
                               result );
                continue;
            }
            console.log( `Input qty ${ input.quantity }` );

            // On divise par deux car dans une assembleuse on produit 2 items par craft
            const itemsPerMinuteNeeded1 = input.quantity * itemsPerMinuteNeeded / 2;
            console.log( `NEDD ${ itemsPerMinuteNeeded1 } ${ input.item }` );
            threeCrafts( input.item, result, itemsPerMinuteNeeded1 );
        } else {
            const thresh = findThresh( input.item );
            if ( thresh.length > 0 ) {
                console.log( `%c IN THRESH`, 'background: #F600FF; color: #000000' );


                const firstIndexThreshNotBlacklisted = thresh.findIndex( ( craft ) => {
                    return !useCraftStore.getState().blacklistedRecipes.includes( craft.id );
                } );

                console.log( `Result for ${ input.item } : `, thresh[ firstIndexThreshNotBlacklisted ] );

                const inputPerMin = convertBaseTimeToItembyMinute( thresh[ firstIndexThreshNotBlacklisted ].base_time ) * useCraftStore.getState().thresherEfficiency;
                console.log( `input per minute = ${ inputPerMin } for ${ input.item }` );


                let outputQty = thresh[ firstIndexThreshNotBlacklisted ].outputs.find( ( output: any ) => output.item === input.item ).quantity;
                const ef      = useCraftStore.getState().thresherEfficiency;
                const qf      = convertBaseTimeToItembyMinute( thresh[ firstIndexThreshNotBlacklisted ].base_time ) * outputQty * ef;


                // TODO : Gérer les superlfux

                updateResults( input.item,
                               itemsPerMinuteNeeded,
                               itemsPerMinuteNeeded / itemPerbelt,
                               itemsPerMinuteNeeded / qf,
                               'Thresher',
                               [],
                               [],
                               result );

                // Ca va compté en double si on a besoin de Kindlevine_Extract et Plantmatter_Fiber dans une même recette par exemple
                updateResults( thresh[ firstIndexThreshNotBlacklisted ].input,
                               inputPerMin * ( itemsPerMinuteNeeded / qf ),
                               inputPerMin / itemPerbelt,
                               itemsPerMinuteNeeded / qf,
                               'Thresher',
                               [],
                               [],
                               result );
            }
        }
    }

    return result;
}

function convertBaseTimeToItembyMinute( baseTime: number ): number {
    return ( 60 / baseTime );
}

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
    const [ item, setItem ]                           = useState<string | null>( null );
    const [ quantityFactories, setQuantityFactories ] = useState<number>( 1 );
    const [ itemsPerMinute, setItemsPerMinute ]       = useState<number>( 5 );
    const [ results, setResults ]                     = useState<ResultType[]>( [] );

    const [ conveyorBelt, setConveyorBelt ] = useState<string>( 'Conveyor_Belt' );
    const [ drill, setDrill ]               = useState<string>( 'Mining_Drill' );
    const [ smelter, setSmelter ]           = useState<string>( 'Smelter' );
    const [ assembler, setAssembler ]       = useState<string>( 'Assembler' );
    const [ thresher, setThresher ]         = useState<string>( 'Thresher' );

    const setBeltCapacity        = useCraftStore( ( state ) => state.setBeltCapacity );
    const setAssemblerEfficiency = useCraftStore( ( state ) => state.setAssemblerEfficiency );
    const setSmelterEfficiency   = useCraftStore( ( state ) => state.setSmelterEfficiency );
    const setThresherEfficiency  = useCraftStore( ( state ) => state.setThresherEfficiency );
    const setDrillEfficiency     = useCraftStore( ( state ) => state.setDrillEfficiency );

    const blacklistedRecipesInStore                     = useCraftStore.getState().blacklistedRecipes;
    const [ blacklistedRecipes, setBlacklistedRecipes ] = useState<string[]>( blacklistedRecipesInStore );


    function onItemChange( id: string ) {
        setItem( id );
    }

    function onQuantityFactoriesChange( event: ChangeEvent<HTMLInputElement> ) {
        setQuantityFactories( Number( event.target.value ) );
        // calculate( 'quantity_factories' );
    }

    function onItemsPerMinuteChange( event: ChangeEvent<HTMLInputElement> ) {
        setItemsPerMinute( Number( event.target.value ) );
        // calculate( 'items_per_minute' );
    }

    function onConveyorBeltChange( id: string ) {
        setConveyorBelt( id );
        if ( id === 'Conveyor_Belt' ) {
            setBeltCapacity( 240 );
        } else if ( id === 'Advanced_Conveyor_Belt' ) {
            setBeltCapacity( 480 );
        } else {
            setBeltCapacity( 720 );
        }

        calculate( 'items_per_minute' );
    }

    function onDrillChange( id: string ) {
        setDrill( id );
        if ( id === 'Mining_Drill' ) {
            setDrillEfficiency( 0.41670001 );
        } else if ( id === 'Advanced_Mining_Drill' ) {
            setDrillEfficiency( 0.625 );
        }

        calculate( 'items_per_minute' );
    }

    function onSmelterChange( id: string ) {
        setSmelter( id );
        if ( id === 'Smelter' ) {
            setSmelterEfficiency( 1 );
        } else if ( id === 'Advanced_Smelter' ) {
            setSmelterEfficiency( 8 );
        }

        calculate( 'items_per_minute' );
    }

    function onAssemblerChange( id: string ) {
        setAssembler( id );
        if ( id === 'Assembler' ) {
            setAssemblerEfficiency( 0.25 );
        } else {
            setAssemblerEfficiency( 0.5 );
        }
        calculate( 'items_per_minute' );
    }

    function onThresherChange( id: string ) {
        setThresher( id );
        if ( id === 'Thresher' ) {
            setThresherEfficiency( 1 );
        } else {
            setThresherEfficiency( 2 );
        }

        calculate( 'items_per_minute' );
    }

    useEffect( () => {
        // calculate( 'quantity_factories' );
        calculate( 'items_per_minute' );
    }, [ item ] );

    useEffect( () => {
        calculate( 'items_per_minute' );
    }, [ itemsPerMinute ] );

    useEffect( () => {
        calculate( 'quantity_factories' );
    }, [ quantityFactories ] );

    function calculate( origin: string ) {
        if ( !item ) {
            return;
        }

        let crafts: ResultType[] = [];
        if ( origin === 'quantity_factories' ) {
            const craft                    = findCraft( item );
            const firstIndexNotBlacklisted = craft.findIndex( ( craft ) => {
                return !useCraftStore.getState().blacklistedRecipes.includes( craft.id );
            } );

            if ( craft.length > 0 ) {
                const assemblerEfficiency     = 0.25;
                const itemPerMinutePerFactory = convertBaseTimeToItembyMinute( craft[ firstIndexNotBlacklisted ].base_time ) * craft[ firstIndexNotBlacklisted ].quantity * assemblerEfficiency;
                crafts                        = threeCrafts( item, [], itemPerMinutePerFactory * quantityFactories );
            }
        } else {
            console.log( 'Before', itemsPerMinute );
            crafts = threeCrafts( item, [], itemsPerMinute );
        }


        setResults( crafts );

    }

    function testBlacklist() {
        const blacklistedRecipes   = useCraftStore.getState().blacklistedRecipes;
        const addBlacklistedRecipe = useCraftStore.getState().addBlacklistedRecipe;

        console.log( blacklistedRecipes );

        // addBlacklistedRecipe( 'Iron_Ingot_2' );
        // addBlacklistedRecipe( 'Iron_Ingot_3' );
        // addBlacklistedRecipe( 'Iron_Ingot_4' );
        addBlacklistedRecipe( 'Infused_Iron' );
    }

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
                        <Button onClick={ testBlacklist }>TEST BLACKLIST</Button>
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
                    <div
                        className="relative hidden flex-col items-start gap-8 md:flex"
                    >
                        <form className="grid w-full items-start gap-6">
                            <fieldset className="grid gap-6 rounded-lg border p-4">
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                    Settings
                                </legend>
                                <div className="grid gap-3">
                                    <Label htmlFor="model">Default transport belt</Label>
                                    <Select value={ conveyorBelt } onValueChange={ onConveyorBeltChange }>
                                        <SelectTrigger id="conveyor_belt"
                                                       className="items-start [&_[data-description]]:hidden">
                                            <SelectValue placeholder="Select a belt" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItemWithImage id="Conveyor_Belt" name="Conveyer Belt" />
                                            <SelectItemWithImage id="Advanced_Conveyor_Belt" name="Conveyer Belt MK2" />
                                            <SelectItemWithImage id="Advanced_Conveyor_Belt_2"
                                                                 name="Conveyer Belt MK3" />
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="model">Default drill</Label>
                                    <Select value={ drill } onValueChange={ onDrillChange }>
                                        <SelectTrigger id="drill"
                                                       className="items-start [&_[data-description]]:hidden">
                                            <SelectValue placeholder="Select a drill" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItemWithImage id="Mining_Drill" name="Mining Drill" />
                                            <SelectItemWithImage id="Advanced_Mining_Drill" name="Drill MK2" />
                                            <SelectItemWithImage id="Blast_Drill" name="Blast Drill" />
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="model">Default smelter</Label>
                                    <Select value={ smelter } onValueChange={ onSmelterChange }>
                                        <SelectTrigger id="smelter"
                                                       className="items-start [&_[data-description]]:hidden">
                                            <SelectValue placeholder="Select a smelter" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItemWithImage id="Smelter" name="Smelter" />
                                            <SelectItemWithImage id="Advanced_Smelter" name="Smelter MK2" />
                                            <SelectItemWithImage id="Blast_Smelter" name="Blast Smelter" />
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="model">Default assembler</Label>
                                    <Select value={ assembler } onValueChange={ onAssemblerChange }>
                                        <SelectTrigger id="assembler"
                                                       className="items-start [&_[data-description]]:hidden">
                                            <SelectValue placeholder="Select a assembler" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItemWithImage id="Assembler" name="Assembler" />
                                            <SelectItemWithImage id="Advanced_Assembler" name="Assembler MK2" />
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="model">Default thresher</Label>
                                    <Select value={ thresher } onValueChange={ onThresherChange }>
                                        <SelectTrigger id="thresher"
                                                       className="items-start [&_[data-description]]:hidden">
                                            <SelectValue placeholder="Select a thresher" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItemWithImage id="Thresher" name="Thresher" />
                                            <SelectItemWithImage id="Advanced_Thresher" name="Thresher MK2" />
                                        </SelectContent>
                                    </Select>
                                </div>

                            </fieldset>
                        </form>
                    </div>
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


