import React, { useEffect } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useCraftStore from '@/stores/craft_store';
import calculate from '@/lib/calculator';
import ContentRow from '@/components/Content/ContentRow';

const TableResult = () => {
    const results = useCraftStore( ( state ) => state.results );


    const item              = useCraftStore( ( state ) => state.item );
    const quantityFactories = useCraftStore( ( state ) => state.quantityFactories );
    const itemsPerMinute    = useCraftStore( ( state ) => state.itemsPerMinute );

    useEffect( () => {
        console.log( '%c IN USE EFFECT', 'background: #B5D0FF; color: #000000' );
        calculate();
    }, [ item, quantityFactories, itemsPerMinute ] );


    return (
        <fieldset className="basis-3/4 grid gap-6 rounded-lg border p-4 min-h-[50vh] w-full">
            <legend className="-ml-1 px-1 text-sm font-medium">
                Results
            </legend>
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
                                <ContentRow result={ result } key={ result.id } />
                            ) )
                        )
                    }
                </TableBody>
            </Table>
        </fieldset>

    );
};

export default TableResult;
