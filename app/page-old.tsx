'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FC, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    output_per_min: number;
    inputs: {
        name: string;
        amount_per_min: number;
    }[];
    additional_crafts?: Result[];
}

const DisplayCraft: FC<Result> = ( { recipe_name, output_per_min, inputs, additional_crafts } ) => {
    return (
        <div>
            <h2>Item to craft : { recipe_name }</h2>
            <p>Output per minute: { output_per_min }</p>
            <p>Inputs : </p>
            <ul>
                {
                    inputs.map( ( input ) => (
                        <li key={ input.name }>
                            { input.name } - { input.amount_per_min }/m
                        </li>
                    ) )
                }
            </ul>
            <Separator className="my-5" />
            {
                additional_crafts && (
                    <ul>
                        {
                            additional_crafts.map( ( craft ) => (
                                <li key={ craft.recipe_name }>
                                    <DisplayCraft { ...craft } />
                                </li>
                            ) )
                        }
                    </ul>
                )
            }
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
        const craft = findCraft( values.item );
        // const crafts    = findCrafts( values.item, null );
        console.log( craft );
        setCraft( craft );
        // console.log( crafts );
        // setCrafts( crafts );

        // if ( type === 'by_output' ) {
        //     setOutput( values.output );
        //     let amount = 0;
        //     if ( crafts ) {
        //         amount = values.output / crafts.amount_per_min;
        //     }
        //     setAmount( amount );
        //
        // } else if ( type === 'by_amount' ) {
        //     setAmount( values.amount );
        //     let output = 0;
        //     if ( crafts ) {
        //         output = crafts.amount_per_min * values.amount;
        //     }
        //     setOutput( output );
        // }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Techtonica Calculator</h1>
            <Form { ...form }>
                <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-8">
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
                    {
                        craft && (
                            <DisplayCraft { ...craft } />
                        )
                    }
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </main>
    );
}

function findCraft( item: string ): Result | null {
    const crafts: CraftData[] = require( '../data/assembler_mk1.json' );

    const craft = crafts.find( ( craft ) => craft.recipe === item );

    if ( craft === undefined ) {
        return null;
    }

    const inputs: { name: string; amount_per_min: number; }[] = [];
    const additional_crafts: Result[]                         = [];

    for ( let i = 0; i < craft.required_inputs.length; i++ ) {
        const input  = craft.required_inputs[ i ];
        const amount = craft.amount_per_min_inputs[ i ];

        inputs.push( { name: input, amount_per_min: amount } );

        const additionalCraft = findCraft( input );

        if ( additionalCraft ) {
            additional_crafts.push( additionalCraft );
        }
    }

    return {
        recipe_name:    craft.recipe,
        output_per_min: craft.amount_per_min,
        inputs,
        additional_crafts,
    };
}
