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
    upgrade_Level: string;
    recipe: string;
    amount_per_min: number;
    required_inputs: string[];
    amount_per_min_inputs: number[];
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
    recipe_name: string;
    nb_required_machine: number;
    output_per_min: number;
    inputs: {
        name: string;
        amount_per_min: number;
    }[];
    additional_crafts?: Result[];
}

const DisplayCraft: FC<Result> = ( {
                                       recipe_name,
                                       output_per_min,
                                       inputs,
                                       additional_crafts,
                                       nb_required_machine,
                                   } ) => {
    return (
        <div className="grid gap-4">
            <div className="mb-3">
                <h3 className="font-semibold">{ recipe_name }</h3>
                <p>Production: <span className="text-green-400 font-bold">{ output_per_min * nb_required_machine }/m</span>
                </p>
                <p>Assembler: { nb_required_machine }</p>
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
                                additional_crafts.map( ( craft ) => (
                                    <li key={ craft.recipe_name } className="flex justify-between">
                                        <span>{ craft.recipe_name }</span>
                                        <span className="text-blue-400 font-bold">{ craft.output_per_min * nb_required_machine }/m</span>
                                    </li>
                                ) )
                            }
                        </ul>
                    </div>
                )
            }

            <Separator className="my-2" />
            <div>
                {
                    additional_crafts && additional_crafts.map( ( craft ) => (
                        <DisplayCraft key={ craft.recipe_name } { ...craft } />
                    ) )
                }
            </div>
        </div>
    );
};

export default function Home() {
    const items: ItemData[] = require( '../data/items.json' );
    const form              = useForm<FormSchema>( {
                                                       defaultValues: {
                                                           item:   'Conveyer_Belt_MK2',
                                                           amount: 1,
                                                           output: 0,
                                                           type:   'by_amount',
                                                       },
                                                   } );

    const [ craft, setCraft ] = useState<Result | null>( null );
    const [ type, setType ]   = useState<string>( 'by_amount' );

    // 2. Define a submit handler.
    function onSubmit( values: FormSchema ) {
        if ( type === 'by_output' ) {
            // setOutput( values.output );
            // let amount = 0;
            // if ( crafts ) {
            //     amount = values.output / crafts.amount_per_min;
            // }
            // setAmount( amount );

        } else if ( type === 'by_amount' ) {
            const craft = findCraft( values.item, values.amount );
            console.log( craft );
            setCraft( craft );
            // setAmount( values.amount );
            // let output = 0;
            // if ( crafts ) {
            //     output = crafts.amount_per_min * values.amount;
            // }
            // setOutput( output );
        }
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

function findCraft( item: string, nbRequiredMachine: number = 1 ): Result | null {
    console.log( `NB Machine for ${ item }`, nbRequiredMachine );
    const crafts: CraftData[] = require( '../data/assembler_mk1.json' );

    const craft = crafts.find( ( craft ) => craft.recipe === item );

    if ( craft === undefined ) {
        return null;
    }

    const inputs: { name: string; amount_per_min: number; }[] = [];
    const additionalCrafts: Result[] = [];

    for ( let i = 0; i < craft.required_inputs.length; i++ ) {
        const input           = craft.required_inputs[ i ];
        let amountPerMinInput = craft.amount_per_min_inputs[ i ];
        amountPerMinInput *= nbRequiredMachine;

        inputs.push( { name: input, amount_per_min: amountPerMinInput } );
        console.log( `need ${ amountPerMinInput } ${ input } per minute` );

        const additionalCraft = findCraft( input, nbRequiredMachine );

        if ( additionalCraft ) {
            console.log( `nbRequiredMachine for ${ item }`,
                         Math.ceil( amountPerMinInput / additionalCraft.output_per_min ) );
            additionalCraft.nb_required_machine = Math.ceil( amountPerMinInput / additionalCraft.output_per_min );

            additionalCrafts.push( additionalCraft );
        }
    }

    return {
        recipe_name:         craft.recipe,
        nb_required_machine: nbRequiredMachine,
        output_per_min:      craft.amount_per_min,
        inputs,
        additional_crafts:   additionalCrafts,
    };
}
