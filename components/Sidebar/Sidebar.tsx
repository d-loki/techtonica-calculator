import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import SelectItemWithImage from '@/components/Global/SelectItemWithImage';
import useCraftStore from '@/stores/craft_store';
import calculate from '@/lib/calculator';

const Sidebar = () => {

    const [ conveyorBelt, setConveyorBelt ] = useState<string>( 'Conveyor_Belt' );
    const [ drill, setDrill ]               = useState<string>( 'Mining_Drill' );
    const [ smelter, setSmelter ]           = useState<string>( 'Smelter' );
    const [ assembler, setAssembler ]       = useState<string>( 'Assembler' );
    const [ thresher, setThresher ]         = useState<string>( 'Thresher' );

    const setBeltCapacity        = useCraftStore( ( state ) => state.setBeltCapacity );
    const setAssemblerEfficiency = useCraftStore( ( state ) => state.setAssemblerEfficiency );
    const setSmelterEfficiency   = useCraftStore( ( state ) => state.setSmelterEfficiency );
    const setThresherEfficiency  = useCraftStore( ( state ) => state.setThresherEfficiency );
    const setDrillEfficiency     = useCraftStore( ( state ) => state.setDrillEfficiency );

    function onConveyorBeltChange( id: string ) {
        setConveyorBelt( id );
        if ( id === 'Conveyor_Belt' ) {
            setBeltCapacity( 240 );
        } else if ( id === 'Advanced_Conveyor_Belt' ) {
            setBeltCapacity( 480 );
        } else {
            setBeltCapacity( 720 );
        }

        calculate();
    }

    function onDrillChange( id: string ) {
        setDrill( id );
        if ( id === 'Mining_Drill' ) {
            setDrillEfficiency( 0.41670001 );
        } else if ( id === 'Advanced_Mining_Drill' ) {
            setDrillEfficiency( 0.625 );
        }

        calculate();
    }

    function onSmelterChange( id: string ) {
        setSmelter( id );
        if ( id === 'Smelter' ) {
            setSmelterEfficiency( 1 );
        } else if ( id === 'Advanced_Smelter' ) {
            setSmelterEfficiency( 8 );
        }

        calculate();
    }

    function onAssemblerChange( id: string ) {
        setAssembler( id );
        if ( id === 'Assembler' ) {
            setAssemblerEfficiency( 0.25 );
        } else {
            setAssemblerEfficiency( 0.5 );
        }
        calculate();
    }

    function onThresherChange( id: string ) {
        setThresher( id );
        if ( id === 'Thresher' ) {
            setThresherEfficiency( 1 );
        } else {
            setThresherEfficiency( 2 );
        }

        calculate();
    }

    return (
        <div
            className="relative hidden flex-col items-start gap-8 md:flex"
        >
            <form className="grid w-full items-start gap-6">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">
                        Settings
                    </legend>
                    <div className="grid gap-3">
                        <Label htmlFor="model">Default transport belt</Label>
                        <Select value={ conveyorBelt } onValueChange={ onConveyorBeltChange }>
                            <SelectTrigger id="conveyor_belt"
                                           className="items-start [&_[data-description]]:hidden">
                                <SelectValue placeholder="Select a belt" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItemWithImage id="Conveyor_Belt" name="Conveyer Belt" />
                                <SelectItemWithImage id="Advanced_Conveyor_Belt" name="Conveyer Belt MK2" />
                                <SelectItemWithImage id="Advanced_Conveyor_Belt_2"
                                                     name="Conveyer Belt MK3" />
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="model">Default drill</Label>
                        <Select value={ drill } onValueChange={ onDrillChange }>
                            <SelectTrigger id="drill"
                                           className="items-start [&_[data-description]]:hidden">
                                <SelectValue placeholder="Select a drill" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItemWithImage id="Mining_Drill" name="Mining Drill" />
                                <SelectItemWithImage id="Advanced_Mining_Drill" name="Drill MK2" />
                                <SelectItemWithImage id="Blast_Drill" name="Blast Drill" />
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="model">Default smelter</Label>
                        <Select value={ smelter } onValueChange={ onSmelterChange }>
                            <SelectTrigger id="smelter"
                                           className="items-start [&_[data-description]]:hidden">
                                <SelectValue placeholder="Select a smelter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItemWithImage id="Smelter" name="Smelter" />
                                <SelectItemWithImage id="Advanced_Smelter" name="Smelter MK2" />
                                <SelectItemWithImage id="Blast_Smelter" name="Blast Smelter" />
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="model">Default assembler</Label>
                        <Select value={ assembler } onValueChange={ onAssemblerChange }>
                            <SelectTrigger id="assembler"
                                           className="items-start [&_[data-description]]:hidden">
                                <SelectValue placeholder="Select a assembler" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItemWithImage id="Assembler" name="Assembler" />
                                <SelectItemWithImage id="Advanced_Assembler" name="Assembler MK2" />
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="model">Default thresher</Label>
                        <Select value={ thresher } onValueChange={ onThresherChange }>
                            <SelectTrigger id="thresher"
                                           className="items-start [&_[data-description]]:hidden">
                                <SelectValue placeholder="Select a thresher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItemWithImage id="Thresher" name="Thresher" />
                                <SelectItemWithImage id="Advanced_Thresher" name="Thresher MK2" />
                            </SelectContent>
                        </Select>
                    </div>

                </fieldset>
            </form>
        </div>
    );
};

export default Sidebar;
