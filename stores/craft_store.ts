import { create } from 'zustand';

interface CraftStore {
    beltCapacity: number;
    drillEfficiency: number;
    assemblerEfficiency: number;
    smelterEfficiency: number;
    thresherEfficiency: number;
    setBeltCapacity: ( beltCapacity: number ) => void;
    setDrillEfficiency: ( drillEfficiency: number ) => void;
    setAssemblerEfficiency: ( assemblerEfficiency: number ) => void;
    setSmelterEfficiency: ( smelterEfficiency: number ) => void;
    setThresherEfficiency: ( thresherEfficiency: number ) => void;
}

const useCraftStore = create<CraftStore>()( ( set ) => ( {
    beltCapacity:           240,
    drillEfficiency:        0.41670001,
    assemblerEfficiency:    0.25,
    smelterEfficiency:      1,
    thresherEfficiency:     1,
    setBeltCapacity:        ( beltCapacity: number ) => set( { beltCapacity } ),
    setDrillEfficiency:     ( drillEfficiency: number ) => set( { drillEfficiency } ),
    setAssemblerEfficiency: ( assemblerEfficiency: number ) => set( { assemblerEfficiency } ),
    setSmelterEfficiency:   ( smelterEfficiency: number ) => set( { smelterEfficiency } ),
    setThresherEfficiency:  ( thresherEfficiency: number ) => set( { thresherEfficiency } ),
} ) );

export default useCraftStore;
