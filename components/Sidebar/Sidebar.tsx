import React from 'react';
import useCraftStore from '@/stores/craft_store';
import calculate from '@/lib/calculator';
import CustomSelect from '@/components/Sidebar/CustomSelect';

const selects = [
    {
        id:      'conveyor_belt',
        label:   'Default transport belt',
        value:   'Conveyor_Belt',
        options: [
            { id: 'Conveyor_Belt', name: 'Conveyer Belt' },
            { id: 'Advanced_Conveyor_Belt', name: 'Conveyer Belt MK2' },
            { id: 'Advanced_Conveyor_Belt_2', name: 'Conveyer Belt MK3' },
        ],
    },
    {
        id:      'drill',
        label:   'Default drill',
        value:   'Mining_Drill',
        options: [
            { id: 'Mining_Drill', name: 'Mining Drill' },
            { id: 'Advanced_Mining_Drill', name: 'Drill MK2' },
            { id: 'Blast_Drill', name: 'Blast Drill' },
        ],
    },
    {
        id:      'smelter',
        label:   'Default smelter',
        value:   'Smelter',
        options: [
            { id: 'Smelter', name: 'Smelter' },
            { id: 'Advanced_Smelter', name: 'Smelter MK2' },
            { id: 'Blast_Smelter', name: 'Blast Smelter' },
        ],
    },
    {
        id:      'assembler',
        label:   'Default assembler',
        value:   'Assembler',
        options: [
            { id: 'Assembler', name: 'Assembler' },
            { id: 'Advanced_Assembler', name: 'Assembler MK2' },
        ],
    },
    {
        id:      'thresher',
        label:   'Default thresher',
        value:   'Thresher',
        options: [
            { id: 'Thresher', name: 'Thresher' },
            { id: 'Advanced_Thresher', name: 'Thresher MK2' },
        ],
    },
];

const Sidebar = () => {
    const setBeltCapacity        = useCraftStore( ( state ) => state.setBeltCapacity );
    const setAssemblerEfficiency = useCraftStore( ( state ) => state.setAssemblerEfficiency );
    const setSmelterEfficiency   = useCraftStore( ( state ) => state.setSmelterEfficiency );
    const setThresherEfficiency  = useCraftStore( ( state ) => state.setThresherEfficiency );
    const setDrillEfficiency     = useCraftStore( ( state ) => state.setDrillEfficiency );

    const setConvoyerBelt = useCraftStore( ( state ) => state.setConveyorBelt );
    const setDrill        = useCraftStore( ( state ) => state.setDrill );
    const setSmelter      = useCraftStore( ( state ) => state.setSmelter );
    const setAssembler    = useCraftStore( ( state ) => state.setAssembler );
    const setThresher     = useCraftStore( ( state ) => state.setThresher );

    function onValueChange( id: string, value: string ) {
        console.log( `ON VALUE CHANGE ${ id } `, value );
        switch ( id ) {
            case 'conveyor_belt':
                onConveyorBeltChange( value );
                break;
            case 'drill':
                onDrillChange( value );
                break;
            case 'smelter':
                onSmelterChange( value );
                break;
            case 'assembler':
                onAssemblerChange( value );
                break;
            case 'thresher':
                onThresherChange( value );
                break;
        }
    }

    function onConveyorBeltChange( id: string ) {
        if ( id === 'Conveyor_Belt' ) {
            setBeltCapacity( 240 );
        } else if ( id === 'Advanced_Conveyor_Belt' ) {
            setBeltCapacity( 480 );
        } else {
            setBeltCapacity( 720 );
        }

        setConvoyerBelt( id );
        calculate();
    }

    function onDrillChange( id: string ) {
        if ( id === 'Mining_Drill' ) {
            setDrillEfficiency( 0.41670001 );
        } else if ( id === 'Advanced_Mining_Drill' ) {
            setDrillEfficiency( 0.625 );
        }

        setDrill( id );
        calculate();
    }

    function onSmelterChange( id: string ) {
        if ( id === 'Smelter' ) {
            setSmelterEfficiency( 1 );
        } else if ( id === 'Advanced_Smelter' ) {
            setSmelterEfficiency( 8 );
        }

        setSmelter( id );
        calculate();
    }

    function onAssemblerChange( id: string ) {
        if ( id === 'Assembler' ) {
            setAssemblerEfficiency( 0.25 );
        } else {
            setAssemblerEfficiency( 0.5 );
        }

        setAssembler( id );
        calculate();
    }

    function onThresherChange( id: string ) {
        if ( id === 'Thresher' ) {
            setThresherEfficiency( 1 );
        } else {
            setThresherEfficiency( 2 );
        }

        setThresher( id );
        calculate();
    }

    return (
        <div
            className="basis-1/4 relative hidden flex-col items-start gap-8 md:flex"
        >
            <form className="grid w-full items-start gap-6">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">
                        Settings
                    </legend>
                    {
                        selects.map( ( select ) => <CustomSelect key={ select.id } { ...select }
                                                                 onValueChange={ onValueChange } /> )
                    }
                </fieldset>
            </form>
        </div>
    );
};

export default Sidebar;
