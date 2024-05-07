import { create } from 'zustand';

interface CraftStore {
    beltCapacity: number;
    assemblerEfficiency: number;
    setBeltCapacity: ( beltCapacity: number ) => void;
    setAssemblerEfficiency: ( assemblerEfficiency: number ) => void;
}

const useCraftStore = create<CraftStore>()( ( set ) => ( {
    beltCapacity:           240,
    assemblerEfficiency:    0.25,
    setBeltCapacity:        ( beltCapacity: number ) => set( { beltCapacity } ),
    setAssemblerEfficiency: ( assemblerEfficiency: number ) => set( { assemblerEfficiency } ),
} ) );

export default useCraftStore;
