import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CraftStore {
    beltCapacity: number;
    drillEfficiency: number;
    assemblerEfficiency: number;
    smelterEfficiency: number;
    thresherEfficiency: number;
    blacklistedRecipes: string[];
    setBeltCapacity: ( beltCapacity: number ) => void;
    setDrillEfficiency: ( drillEfficiency: number ) => void;
    setAssemblerEfficiency: ( assemblerEfficiency: number ) => void;
    setSmelterEfficiency: ( smelterEfficiency: number ) => void;
    setThresherEfficiency: ( thresherEfficiency: number ) => void;
    addBlacklistedRecipe: ( recipe: string ) => void;
    removeBlacklistedRecipe: ( recipe: string ) => void;
}

const useCraftStore = create<CraftStore>()(
    persist(
        ( set ) => ( {
            beltCapacity:            240,
            drillEfficiency:         0.41670001,
            assemblerEfficiency:     0.25,
            smelterEfficiency:       1,
            thresherEfficiency:      1,
            blacklistedRecipes:      [],
            setBeltCapacity:         ( beltCapacity: number ) => set( { beltCapacity } ),
            setDrillEfficiency:      ( drillEfficiency: number ) => set( { drillEfficiency } ),
            setAssemblerEfficiency:  ( assemblerEfficiency: number ) => set( { assemblerEfficiency } ),
            setSmelterEfficiency:    ( smelterEfficiency: number ) => set( { smelterEfficiency } ),
            setThresherEfficiency:   ( thresherEfficiency: number ) => set( { thresherEfficiency } ),
            addBlacklistedRecipe:    ( recipe: string ) => set( ( state ) => ( {
                blacklistedRecipes: [ ...state.blacklistedRecipes, recipe ],
            } ) ),
            removeBlacklistedRecipe: ( recipe: string ) => set( ( state ) => ( {
                                                                    blacklistedRecipes: state.blacklistedRecipes.filter( ( r ) => r !== recipe ),
                                                                } ),
            ),
        } ), {
            name:       'craft-storage',
            partialize: ( state ) => ( { blacklistedRecipes: state.blacklistedRecipes } ),
        } ) );

export default useCraftStore;
