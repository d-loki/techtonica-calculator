import React, { FC } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollapsibleContent } from '@/components/ui/collapsible';
import ResultType from '@/type/ResultType';
import CollapsibleItem from '@/components/Content/Collapsible/CollapsibleItem';
import CollapsibleRecipes from '@/components/Content/Collapsible/CollapsibleRecipes';

type Props = {
    result: ResultType;
}

const CollapsibleRow: FC<Props> = ( { result } ) => {
    return (
        <CollapsibleContent asChild>
            <TableRow>
                <TableCell colSpan={ 4 } className="bg-cyan-50">
                    <Tabs defaultValue="item" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="item">Items</TabsTrigger>
                            <TabsTrigger value="recipe">Recipes</TabsTrigger>
                        </TabsList>
                        <CollapsibleItem result={ result } />
                        <CollapsibleRecipes result={ result } />
                    </Tabs>
                </TableCell>
            </TableRow>
        </CollapsibleContent>
    );
};

export default CollapsibleRow;
