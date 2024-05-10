import React, { FC } from 'react';
import Image from 'next/image';
import useCraftStore from '@/stores/craft_store';

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

    return ( <Image className="rounded"
                    src={ `/items/${ factory }.png` }
                    alt="Factories"
                    width={ 48 }
                    height={ 48 } /> );

};

export default FactoryImg;
