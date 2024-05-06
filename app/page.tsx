'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useState } from 'react';

type CraftType = {
    id: string;
    output: string;
    quantity: number;
    inputs: { item: string, quantity: number }[];
    base_time: number;
    produced_in: string;
}

function getAllItems(): { id: string, name: string }[] {
    return require( '../data/v3/dist/items.json' );
}

function findCraft( id: string ): CraftType[] {
    return require( '../data/v3/dist/craft.json' ).filter( ( craft: any ) => craft.output === id );
}

function convertBaseTimeToItembyMinute( baseTime: number ): number {
    return 60 / baseTime;
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

export default function Home() {
    const [ craft, setCraft ] = useState<CraftType | null>( null );

    function onItemChange( id: string ) {
        const craft = findCraft( id );
        console.log( craft );
        setCraft( craft[ 0 ] );
    }

    return (
        <div className="grid h-screen w-full pl-[56px]">
            <div className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                    <h1 className="text-xl font-semibold">Calculator</h1>
                    <div className="flex gap-4 ml-16">
                        <Select defaultValue="Mining_Drill" onValueChange={ onItemChange }>
                            <SelectTrigger id="item" className="items-start [&_[data-description]]:hidden">
                                <SelectValue placeholder="Items" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    getAllItems().map( ( item ) => (
                                        <SelectItemWithImage key={ item.id } id={ item.id } name={ item.name } />
                                    ) )
                                }
                            </SelectContent>
                        </Select>
                        <Input defaultValue={ 1 } id="quantity" type="number" placeholder="1" />
                        <Select defaultValue="items_per_minute">
                            <SelectTrigger id="units" className="items-start [&_[data-description]]:hidden">
                                <SelectValue placeholder="Units" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="items_per_minute">
                                    Items/m
                                </SelectItem>
                                <SelectItem value="machine">
                                    Machines
                                </SelectItem>
                            </SelectContent>
                        </Select>

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
                                    <Select defaultValue="Conveyor_Belt">
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
                                    <Select defaultValue="Mining_Drill">
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
                                    <Select defaultValue="Smelter">
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
                                    <Select defaultValue="Assembler">
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
                                    <Select defaultValue="Thresher">
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
                            {
                                craft && (
                                    <div>
                                        <div className="grid gap-2 p-4">
                                            <div className="grid gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Image className="rounded"
                                                           src={ `/items/${ craft.output }.png` } alt={ craft.output }
                                                           width={ 24 } height={ 24 } />
                                                    <span>{ craft.output }</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <span>Quantity</span>
                                                <span>{ craft.quantity }</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span>Base time</span>
                                                <span>{ craft.base_time }s</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <span>Items/m</span>
                                                <span>{ convertBaseTimeToItembyMinute( craft.base_time ) }</span>
                                            </div>
                                            <div className="grid gap-2">
                                                <span>Produced in</span>
                                                <div className="flex items-center gap-2">
                                                    <Image className="rounded"
                                                           src={ `/items/${ craft.produced_in }.png` }
                                                           alt={ craft.produced_in } width={ 24 } height={ 24 } />
                                                    <span>{ craft.produced_in }</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid gap-2 p-4">
                                            <h2 className="text-lg font-semibold">Inputs</h2>
                                            {
                                                craft.inputs.map( ( input ) => (
                                                    <div key={ input.item } className="grid gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Image className="rounded"
                                                                   src={ `/items/${ input.item }.png` } alt={ input.item }
                                                                   width={ 24 } height={ 24 } />
                                                            <span>{ input.item }</span>
                                                            <span>{ input.quantity }</span>
                                                        </div>
                                                    </div>
                                                ) )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}


