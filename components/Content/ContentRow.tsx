import React, { FC, ReactElement, useState } from 'react';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TableCell, TableRow } from '@/components/ui/table';
import { Asterisk, ChevronDown, X } from 'lucide-react';
import ResultType from '@/type/ResultType';
import useCraftStore from '@/stores/craft_store';
import CollapsibleRow from '@/components/Content/Collapsible/CollapsibleRow';
import ItemImage from '@/components/Global/ItemImage';
import FactoryImg from '@/components/Content/FactoryImg';
import { cn } from '@/lib/utils';

type Props = {
    result: ResultType;
}

type CellContentProps = {
    itemId: string;
    value: number;
    customImage?: ReactElement;
}

const CellContent: FC<CellContentProps> = ( { itemId, value, customImage } ) => {
    return (
        <div className="flex items-center gap-2">
            {
                customImage ? (
                    customImage
                ) : (
                    <ItemImage src={ `/items/${ itemId }.png` } alt={ itemId } />
                )
            }
            <Asterisk className="h-4 w-4" />
            <span>{ value.toFixed( 2 ) }</span>
        </div>
    );
};


const ContentRow: FC<Props> = ( { result } ) => {
    const [ isOpen, setIsOpen ] = useState( false );
    const conveyorBelt          = useCraftStore( ( state ) => state.conveyorBelt );

    return (
        <Collapsible open={ isOpen } onOpenChange={ setIsOpen } asChild>
            <>
                <TableRow className={ cn( 'hover:bg-background', isOpen && 'border-b-0' ) }>
                    <CollapsibleTrigger asChild>
                        <TableCell className="group w-16 cursor-pointer">
                            {
                                isOpen ? (
                                    <X className={ cn( 'size-4 mx-auto', isOpen && 'animate-rotate-90' ) } />
                                ) : (
                                    <ChevronDown className="size-4 mx-auto" />
                                )
                            }
                        </TableCell>
                    </CollapsibleTrigger>
                    <TableCell>
                        <CellContent itemId={ result.output } value={ result.items_per_minute } />
                    </TableCell>
                    <TableCell>
                        <CellContent itemId={ conveyorBelt } value={ result.belts } />
                    </TableCell>
                    <TableCell>
                        <CellContent itemId={ result.produced_in } value={ result.belts }
                                     customImage={ <FactoryImg produced_in={ result.produced_in } /> }
                        />
                    </TableCell>
                </TableRow>
                <CollapsibleRow result={ result } />
            </>
        </Collapsible>
    );
};

export default ContentRow;
