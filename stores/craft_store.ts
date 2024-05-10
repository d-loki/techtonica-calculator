import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResultType } from '@/app/page';

interface CraftStore {
    calculType: 'items_per_minute' | 'quantity_factories';
    item: string | null;
    quantityFactories: number;
    itemsPerMinute: number;

    conveyorBelt: string;
    drill: string;
    smelter: string;
    assembler: string;
    thresher: string;

    beltCapacity: number;
    drillEfficiency: number;
    assemblerEfficiency: number;
    smelterEfficiency: number;
    thresherEfficiency: number;

    blacklistedRecipes: string[];

    results: ResultType[];

    setCalculType: ( calculType: 'items_per_minute' | 'quantity_factories' ) => void;
    setItem: ( item: string ) => void;
    setQuantityFactories: ( quantityFactories: number ) => void;
    setItemsPerMinute: ( itemsPerMinute: number ) => void;

    setConveyorBelt: ( conveyorBelt: string ) => void;
    setDrill: ( drill: string ) => void;
    setSmelter: ( smelter: string ) => void;
    setAssembler: ( assembler: string ) => void;
    setThresher: ( thresher: string ) => void;

    setBeltCapacity: ( beltCapacity: number ) => void;
    setDrillEfficiency: ( drillEfficiency: number ) => void;
    setAssemblerEfficiency: ( assemblerEfficiency: number ) => void;
    setSmelterEfficiency: ( smelterEfficiency: number ) => void;
    setThresherEfficiency: ( thresherEfficiency: number ) => void;

    addBlacklistedRecipe: ( recipe: string ) => void;
    removeBlacklistedRecipe: ( recipe: string ) => void;

    setResults: ( results: ResultType[] ) => void;
}

const useCraftStore = create<CraftStore>()(
    persist(
        ( set ) => ( {
            calculType:        'items_per_minute',
            item:              null,
            quantityFactories: 1,
            itemsPerMinute:    5,

            conveyorBelt: 'Conveyor_Belt',
            drill:        'Mining_Drill',
            smelter:      'Smelter',
            assembler:    'Assembler',
            thresher:     'Thresher',

            beltCapacity:        240,
            drillEfficiency:     0.41670001,
            assemblerEfficiency: 0.25,
            smelterEfficiency:   1,
            thresherEfficiency:  1,

            blacklistedRecipes: [],

            results: [],

            setCalculType:        ( calculType: 'items_per_minute' | 'quantity_factories' ) => set( { calculType } ),
            setItem:              ( item: string ) => set( { item } ),
            setQuantityFactories: ( quantityFactories: number ) => set( { quantityFactories } ),
            setItemsPerMinute:    ( itemsPerMinute: number ) => set( { itemsPerMinute } ),

            setConveyorBelt: ( conveyorBelt: string ) => set( { conveyorBelt } ),
            setDrill:        ( drill: string ) => set( { drill } ),
            setSmelter:      ( smelter: string ) => set( { smelter } ),
            setAssembler:    ( assembler: string ) => set( { assembler } ),
            setThresher:     ( thresher: string ) => set( { thresher } ),

            setBeltCapacity:        ( beltCapacity: number ) => set( { beltCapacity } ),
            setDrillEfficiency:     ( drillEfficiency: number ) => set( { drillEfficiency } ),
            setAssemblerEfficiency: ( assemblerEfficiency: number ) => set( { assemblerEfficiency } ),
            setSmelterEfficiency:   ( smelterEfficiency: number ) => set( { smelterEfficiency } ),
            setThresherEfficiency:  ( thresherEfficiency: number ) => set( { thresherEfficiency } ),

            addBlacklistedRecipe:    ( recipe: string ) => set( ( state ) => ( {
                blacklistedRecipes: [ ...state.blacklistedRecipes, recipe ],
            } ) ),
            removeBlacklistedRecipe: ( recipe: string ) => set( ( state ) => ( {
                                                                    blacklistedRecipes: state.blacklistedRecipes.filter( ( r ) => r !== recipe ),
                                                                } ),
            ),

            setResults: ( results: ResultType[] ) => set( { results } ),
        } ), {
            name:       'craft-storage',
            partialize: ( state ) => ( { blacklistedRecipes: state.blacklistedRecipes } ),
        } ) );

export default useCraftStore;
