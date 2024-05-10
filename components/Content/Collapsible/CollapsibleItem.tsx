import React, { FC } from 'react';
import { ArrowRight } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import ResultType from '@/type/ResultType';
import ItemImage from '@/components/Global/ItemImage';

type Props = {
    result: ResultType;
}

const CollapsibleItem: FC<Props> = ( { result } ) => {
    return (
        <TabsContent value="item" className="px-5">
            {
                result.inputs.map( ( input, index ) => (
                    <div key={ index } className="flex items-center gap-3 my-2">
                        <ItemImage size="xs" src={ `/items/${ input.item }.png` } alt={ input.item } />
                        <ArrowRight className="h-4 w-4" />
                        <ItemImage size="xs" src={ `/items/${ result.output }.png` } alt={ result.output } />
                    </div>
                ) )
            }

        </TabsContent>
    );
};

export default CollapsibleItem;
