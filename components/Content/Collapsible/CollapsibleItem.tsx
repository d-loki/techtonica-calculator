import React, { FC } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import ResultType from '@/type/ResultType';

type Props = {
    result: ResultType;
}

const CollapsibleItem: FC<Props> = ( { result } ) => {
    return (
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
    );
};

export default CollapsibleItem;
