import React, { FC } from 'react';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TableCell, TableRow } from '@/components/ui/table';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import FactoryImg from '@/components/Content/FactoryImg';
import ResultType from '@/type/ResultType';
import useCraftStore from '@/stores/craft_store';
import CollapsibleRow from '@/components/Content/Collapsible/CollapsibleRow';

type Props = {
    result: ResultType;
}


const ContentRow: FC<Props> = ( { result } ) => {
    const conveyorBelt = useCraftStore( ( state ) => state.conveyorBelt );

    return (
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
                                <FactoryImg produced_in={ result.produced_in } />
                                X
                            </div>
                            <span>{ result.quantity_factories.toFixed( 2 ) }</span>
                        </div>
                    </TableCell>
                </TableRow>
                <CollapsibleRow result={ result } />
            </>
        </Collapsible>
    );
};

export default ContentRow;
