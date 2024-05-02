'use client';

import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FC, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

type CraftData = {
    efficiency: string;
    outputs: string[];
    outputs_per_min: number[];
    inputs: string[];
    inputs_per_min: number[];
}

type ItemData = {
    name: string;
    stack_size: number;
}

type FormSchema = {
    item: string;
    amount: number;
    output: number;
    type: 'by_amount' | 'by_output'
}

type Result = {
    outputs: {
        name: string;
        amount_per_min: number;
    }[];
    nb_required_machine: number;
    inputs: {
        name: string;
        amount_per_min: number;
    }[];
    additional_crafts?: Result[];
}

const DisplayCraft: FC<Result> = ( {
                                       outputs,
                                       inputs,
                                       additional_crafts,
                                       nb_required_machine,
                                   } ) => {
    return (
        <div className="grid gap-4">
            <div className="mb-3">
                {
                    outputs.map( ( output ) => (
                        <div key={ output.name } className="mb-2">
                            <div className="flex justify-between mb-1">
                                <span>{ output.name }</span>
                                <span className="text-green-400 font-bold">{ output.amount_per_min }/m</span>
                            </div>
                            <div>
                                <span>Machines: { nb_required_machine }</span>
                            </div>
                        </div>
                    ) )
                }
            </div>
            <div className="mb-3">
                <h4 className="font-medium mb-2">Input items</h4>
                <ul className="grid gap-2">
                    {
                        inputs.map( ( input ) => (
                            <li key={ input.name } className="flex justify-between">
                                <span>{ input.name }</span>
                                <span className="text-red-400 font-bold">{ input.amount_per_min }/m</span>
                            </li>
                        ) )
                    }
                </ul>
            </div>
            {
                additional_crafts && additional_crafts.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">Intermediate Crafts</h4>
                        <ul className="grid gap-2">
                            {
                                additional_crafts.map( ( craft ) => {
                                    return (
                                        craft.outputs.map( ( output ) => (
                                            <li key={ output.name } className="flex justify-between">
                                                <span>{ output.name }</span>
                                                <span className="text-green-400 font-bold">{ output.amount_per_min }/m</span>
                                            </li>
                                        ) )

                                    );
                                } )
                            }
                        </ul>
                    </div>
                )
            }

            <Separator className="my-2" />
            <div>
                {
                    additional_crafts && additional_crafts.map( ( craft ) => {
                        const key = crypto.randomUUID();
                        return ( <DisplayCraft key={ key } { ...craft } /> );
                    } )
                }
            </div>
        </div>
    );
};

export default function Home() {
    const items: ItemData[] = getAllItems();
    const form              = useForm<FormSchema>( {
                                                       defaultValues: {
                                                           item:   'Conveyer_Belt_MK2',
                                                           amount: 1,
                                                           output: 0,
                                                           type: 'by_output',
                                                       },
                                                   } );

    const [ craft, setCraft ] = useState<Result | null>( null );
    const [ type, setType ] = useState<string>( 'by_output' );

    // 2. Define a submit handler.
    function onSubmit( values: FormSchema ) {
        if ( type === 'by_output' ) {
            const craft = findCraftByOutputPerMinute( values.item, values.output );
            console.log( craft );
            setCraft( craft );
        } else if ( type === 'by_amount' ) {
            console.log( '%c IN BY AMOUNT', 'background: #fdd835; color: #000000' );
            const crafts: CraftData[] = getAllCraftData();

            const craftData = crafts.find( ( craft ) => {
                return craft.outputs.includes( values.item );
            } );

            if ( craftData === undefined ) {
                return;
            }

            const craft = findCraftByOutputPerMinute( values.item, craftData.outputs_per_min[ 0 ] * values.amount );
            console.log( craft );
            setCraft( craft );
        }
        console.log( craft );
    }

    return (
        <div key="1" className="container mx-auto max-w-6xl py-8 grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Craft Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form { ...form }>
                        <form onSubmit={ form.handleSubmit( onSubmit ) } className="grid gap-4">
                            <FormField
                                control={ form.control }
                                name="item"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Item</FormLabel>
                                        <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an item" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    items.map( ( item ) => (
                                                        <SelectItem key={ item.name } value={ item.name }>
                                                            { item.name }
                                                        </SelectItem>
                                                    ) )
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="type"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={ ( e ) => setType( e ) } defaultValue={ field.value }>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="by_output">By Output</SelectItem>
                                                <SelectItem value="by_amount">By Amount</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            {
                                type === 'by_output' && (
                                    <FormField
                                        control={ form.control }
                                        name="output"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Ouput per minute</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="1" { ...field } />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                )
                            }
                            {
                                type !== 'by_output' && (
                                    <FormField
                                        control={ form.control }
                                        name="amount"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Amount of Assemblers</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="1" { ...field } />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                )
                            }
                            <Button type="submit">Calculate</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Craft Results</CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        craft && (
                            <DisplayCraft { ...craft } />
                        )
                    }
                </CardContent>
            </Card>
        </div>
    );
}

function findCraftByOutputPerMinute( item: string, outputPerMinuteNeeded: number ): Result | null {
    console.log( `outputPerMinute needed for ${ item }: `, outputPerMinuteNeeded );

    const crafts: CraftData[] = getAllCraftData();

    const craft = crafts.find( ( craft ) => {
        return craft.outputs.includes( item );
    } );


    if ( craft === undefined ) {
        return null;
    }
    console.log( craft );
    console.log( craft.outputs_per_min );

    let nbRequiredMachine = 1;
    for ( let i = 0; i < craft.outputs_per_min.length; i++ ) {
        const outputPerMin = craft.outputs_per_min[ i ];
        if ( Math.ceil( outputPerMinuteNeeded / outputPerMin ) > nbRequiredMachine ) {
            nbRequiredMachine = Math.ceil( outputPerMinuteNeeded / outputPerMin );
        }
    }
    console.log( `NB Machine for ${ item }`, nbRequiredMachine );

    const inputs: { name: string; amount_per_min: number; }[] = [];
    const additionalCrafts: Result[]                          = [];

    for ( let i = 0; i < craft.inputs.length; i++ ) {
        const input           = craft.inputs[ i ];
        let amountPerMinInput = craft.inputs_per_min[ i ];
        amountPerMinInput *= nbRequiredMachine;

        inputs.push( { name: input, amount_per_min: amountPerMinInput } );
        console.log( `need ${ amountPerMinInput } ${ input } per minute` );

        const additionalCraft = findCraftByOutputPerMinute( input, amountPerMinInput );

        if ( additionalCraft ) {
            additionalCrafts.push( additionalCraft );
        }
    }

    const outputs: { name: string; amount_per_min: number; }[] = [];
    for ( let i = 0; i < craft.outputs.length; i++ ) {
        const output           = craft.outputs[ i ];
        let amountPerMinOutput = craft.outputs_per_min[ i ];
        amountPerMinOutput *= nbRequiredMachine;

        outputs.push( { name: output, amount_per_min: amountPerMinOutput } );
    }

    return {
        outputs: outputs,
        nb_required_machine: nbRequiredMachine,
        inputs,
        additional_crafts:   additionalCrafts,
    };
}

function getAllItems(): ItemData[] {
    const items = require( '../data/items.json' );
    items.sort( ( a: ItemData, b: ItemData ) => {
        return a.name.localeCompare( b.name );
    } );

    return items;
}

function getAllCraftData(): CraftData[] {
    const assemblers = require( '../data/assembler_mk1.json' );
    const threshers  = require( '../data/thresher_mk1.json' );

    return [ ...assemblers, ...threshers ];
}

