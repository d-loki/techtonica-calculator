import React, { FC } from 'react';
import useCraftStore from '@/stores/craft_store';
import ItemImage from '@/components/Global/ItemImage';

type FactoryImgProps = {
    produced_in: string | null;
}

const FactoryImg: FC<FactoryImgProps> = ( { produced_in } ) => {
    const drill     = useCraftStore( ( state ) => state.drill );
    const smelter   = useCraftStore( ( state ) => state.smelter );
    const assembler = useCraftStore( ( state ) => state.assembler );
    const thresher  = useCraftStore( ( state ) => state.thresher );

    let factory = '';
    switch ( produced_in ) {
        case 'Mining_Drill':
            factory = drill;
            break;
        case 'Smelter':
            factory = smelter;
            break;
        case 'Assembler':
            factory = assembler;
            break;
        case 'Thresher':
            factory = thresher;
            break;
    }

    if ( factory === '' ) {
        return null;
    }

    return ( <ItemImage src={ `/items/${ factory }.png` } alt={ factory } /> );

};

export default FactoryImg;
