import useCraftStore from '@/stores/craft_store';
import CraftType from '@/type/CraftType';
import ThreshType from '@/type/ThreshType';
import AlternativeRecipe from '@/type/AlternativeRecipe';
import ResultType from '@/type/ResultType';
import DrillType from '@/type/DrillType';

function randomId() {
    return Math.random().toString( 36 ).substring( 2, 15 ) + Math.random().toString( 36 ).substring( 2, 15 );
}

function convertBaseTimeToItembyMinute( baseTime: number ): number {
    return ( 60 / baseTime );
}


export function findCraft( id: string ): CraftType[] {
    const crafts = require( '../data/v3/dist/craft.json' );

    return crafts.filter( ( craft: any ) => ( craft.output === id ) );
}

export function findThresh( id: string ): ThreshType[] {
    const thresh = require( '../data/v3/dist/thresh.json' );

    return thresh.filter( ( craft: any ) => {
        return craft.outputs.find( ( output: any ) => output.item === id );
    } );
}

export function findDrill( id: string ): DrillType[] {
    const drills = require( '../data/v3/dist/drill.json' );

    return drills.filter( ( drill: any ) => drill.output === id );
}

function updateResults( output: string,
                        itemsPerMinute: number,
                        belts: number,
                        quantityFactories: number,
                        produced_in: string | null,
                        inputs: { item: string, quantity: number }[],
                        recipes: AlternativeRecipe[],
                        results: ResultType[] ) {
    const existingIndex = results.findIndex( ( result ) => result.output === output );
    if ( existingIndex > -1 ) {
        results[ existingIndex ].items_per_minute += itemsPerMinute;
        results[ existingIndex ].belts += belts;
        results[ existingIndex ].quantity_factories += quantityFactories;
    } else {
        results.push( {
                          id:                 randomId(),
                          output,
                          items_per_minute:   itemsPerMinute,
                          belts,
                          quantity_factories: quantityFactories,
                          produced_in:        produced_in ?? '',
                          recipes,
                          inputs,
                      } );
    }
}

export function getBlacklistedRecipes(): string[] {
    return useCraftStore.getState().blacklistedRecipes;
}


export function threeCrafts( id: string, result: any[] = [], itemsPerMinuteNeeded = 1 ): ResultType[] {

    console.log( '%c threeCrafts', 'background: #3DFFC0; color: #000000' );
    const craft = findCraft( id );
    const t     = findThresh( id );

    console.log( `findThresh for ${ id } `, t );
    if ( craft.length === 0 && t.length === 0 ) {
        console.log( `%c NO CRAFT OR THRESH FOR ${ id }`, 'background: #FF000A; color: #000000' );
        return [];
    }

    const itemPerbelt         = useCraftStore.getState().beltCapacity;
    const assemblerEfficiency = useCraftStore.getState().assemblerEfficiency;

    const firstIndexNotBlacklisted = craft.findIndex( ( craft ) => {
        return !getBlacklistedRecipes().includes( craft.id );
    } );
    console.log( 'firstIndexNotBlacklisted', firstIndexNotBlacklisted );

    let efficiency = 0;
    switch ( craft[ firstIndexNotBlacklisted ].produced_in ) {
        case 'Mining_Drill':
            efficiency = useCraftStore.getState().drillEfficiency;
            break;
        case 'Smelter':
            console.log( '%c IN SMELTER', 'background: #FF80C7; color: #000000' );
            efficiency = useCraftStore.getState().smelterEfficiency;
            break;
        case 'Assembler':
            efficiency = useCraftStore.getState().assemblerEfficiency;
            break;
        case 'Thresher':
            efficiency = useCraftStore.getState().thresherEfficiency;
            break;
    }

    const itemPerMinutePerFactory = convertBaseTimeToItembyMinute( craft[ firstIndexNotBlacklisted ].base_time ) * craft[ firstIndexNotBlacklisted ].quantity * efficiency;
    const quantityFactories       = itemsPerMinuteNeeded / itemPerMinutePerFactory;


    console.log( `NEED ${ itemsPerMinuteNeeded } ${ id } per minute` );
    console.log( `Item per minute factory ${ itemPerMinutePerFactory }` );
    console.log( `Quantity factories ${ quantityFactories }` );

    if ( craft.length > 0 ) {
        const shortRecipes = craft.map( ( craft ) => {
            return {
                id:     craft.id,
                inputs: craft.inputs.map( ( input ) => input.item ),
            };
        } );
        console.log( `shortRecipes for ${ id }`, shortRecipes );

        const inputs = craft[ firstIndexNotBlacklisted ].inputs.map( ( input ) => {
            return {
                item:     input.item,
                quantity: input.quantity,
            };
        } );

        updateResults( craft[ firstIndexNotBlacklisted ].output,
                       itemsPerMinuteNeeded,
                       itemsPerMinuteNeeded / itemPerbelt,
                       quantityFactories,
                       craft[ firstIndexNotBlacklisted ].produced_in,
                       inputs,
                       shortRecipes,
                       result );
    }

    for ( const input of craft[ firstIndexNotBlacklisted ].inputs ) {
        console.log( `CRAFT FOR INPUT : ${ input.item }` );
        const inputCraft = findCraft( input.item );
        console.log( `findThresh for input ${ id } `, findThresh( id ) );

        const firstIndexInputNotBlacklisted = inputCraft.findIndex( ( craft ) => {
            return !getBlacklistedRecipes().includes( craft.id );
        } );


        console.log( inputCraft );
        if ( inputCraft[ firstIndexInputNotBlacklisted ] !== undefined ) {
            console.log( `AA_ IF 1 ${ id }` );
            // Si dans les inputs du craft on à le dernier output du dernier craft on stop afin de ne pas avoir de circulaire
            const findCirculare = inputCraft[ firstIndexInputNotBlacklisted ].inputs.find( ( input ) => input.item === craft[ firstIndexNotBlacklisted ].output );

            if ( findCirculare ) {
                console.log( `%c CIRCULAR FOR ${ input.item }`, 'background: #FFB122; color: #000000' );
                const shortRecipes = inputCraft.map( ( craft ) => {
                    return {
                        id:     craft.id,
                        inputs: craft.inputs.map( ( input ) => input.item ),
                    };
                } );

                const inputs = inputCraft[ firstIndexInputNotBlacklisted ].inputs.map( ( input ) => {
                    return {
                        item:     input.item,
                        quantity: input.quantity,
                    };
                } );


                updateResults( input.item,
                               itemsPerMinuteNeeded,
                               itemsPerMinuteNeeded / itemPerbelt,
                               0,
                               null,
                               inputs,
                               shortRecipes,
                               result );
                continue;
            }
            console.log( `Input qty ${ input.quantity }` );

            let itemsPerMinuteNeeded1 = input.quantity * itemsPerMinuteNeeded;
            if ( craft[ firstIndexNotBlacklisted ].produced_in === 'Assembler' ) {
                // On divise par deux car dans une assembleuse on produit 2 items par craft
                itemsPerMinuteNeeded1 = itemsPerMinuteNeeded1 / 2;
            }

            console.log( `NEDD ${ itemsPerMinuteNeeded1 } ${ input.item }` );
            threeCrafts( input.item, result, itemsPerMinuteNeeded1 );
        } else {
            console.log( `AA_ ELSE 1 ${ id }` );

            const thresh                         = findThresh( input.item );
            const firstIndexThreshNotBlacklisted = thresh.findIndex( ( craft ) => {
                return !getBlacklistedRecipes().includes( craft.id );
            } );

            if ( thresh[ firstIndexThreshNotBlacklisted ] !== undefined ) {
                console.log( `%c IN THRESH`, 'background: #F600FF; color: #000000' );


                console.log( `AA_ Result for ${ input.item } : `, thresh[ firstIndexThreshNotBlacklisted ] );

                const inputPerMin = convertBaseTimeToItembyMinute( thresh[ firstIndexThreshNotBlacklisted ].base_time ) * useCraftStore.getState().thresherEfficiency;
                console.log( `input per minute = ${ inputPerMin } for ${ input.item }` );


                const output  = thresh[ firstIndexThreshNotBlacklisted ].outputs.find( ( output: any ) => output.item === input.item );
                let outputQty = output ? output.quantity : 1;
                const ef      = useCraftStore.getState().thresherEfficiency;
                const qf      = convertBaseTimeToItembyMinute( thresh[ firstIndexThreshNotBlacklisted ].base_time ) * outputQty * ef;


                // TODO : Gérer les superlfux

                updateResults( input.item,
                               itemsPerMinuteNeeded,
                               itemsPerMinuteNeeded / itemPerbelt,
                               itemsPerMinuteNeeded / qf,
                               'Thresher',
                               [],
                               [],
                               result );

                // Ca va compté en double si on a besoin de Kindlevine_Extract et Plantmatter_Fiber dans une même recette par exemple
                updateResults( thresh[ firstIndexThreshNotBlacklisted ].input,
                               inputPerMin * ( itemsPerMinuteNeeded / qf ),
                               inputPerMin / itemPerbelt,
                               itemsPerMinuteNeeded / qf,
                               'Thresher',
                               [],
                               [],
                               result );
            } else {
                console.log( `AA_ ELSE 2 ${ id }` );
                const drill = findDrill( input.item );
                console.log( 'AA_ input', input );
                console.log( 'AA_ DRIL', drill );

                if ( drill.length > 0 ) {
                    console.log( `%c IN DRILL`, 'background: #F600FF; color: #000000' );

                    console.log( 'AA_ itemsPerMinuteNeeded', itemsPerMinuteNeeded );
                    console.log( 'AA_ ', drill[ 0 ].base_time );
                    console.log( 'AA_ ', convertBaseTimeToItembyMinute( drill[ 0 ].base_time ) );
                    console.log( 'AA_ ', useCraftStore.getState().drillEfficiency );
                    const inputPerMin = convertBaseTimeToItembyMinute( drill[ 0 ].base_time ) * useCraftStore.getState().drillEfficiency;
                    console.log( `AA_ input per minute = ${ inputPerMin } for ${ input.item }` );

                    const ef = useCraftStore.getState().drillEfficiency;
                    const qf = convertBaseTimeToItembyMinute( drill[ 0 ].base_time ) * drill[ 0 ].quantity * ef;

                    console.log( 'AA_ QF', qf );
                    updateResults( input.item,
                                   itemsPerMinuteNeeded * input.quantity,
                                   itemsPerMinuteNeeded * input.quantity / itemPerbelt,
                                   itemsPerMinuteNeeded * input.quantity / qf,
                                   'Mining_Drill',
                                   [],
                                   [],
                                   result );
                    console.log( 'AA_ result', result );

                    // Ca va compté en double si on a besoin de Kindlevine_Extract et Plantmatter_Fiber dans une même recette par exemple
                    // updateResults( drill[ firstIndexDrillNotBlacklisted ].input,
                    //                inputPerMin * ( itemsPerMinuteNeeded / qf ),
                    //                inputPerMin / itemPerbelt,
                    //                itemsPerMinuteNeeded / qf,
                    //                'Drill',
                    //                [],
                    //                [],
                    //                result );
                }

            }
        }
    }

    return result;
}


function calculate() {
    const calculType        = useCraftStore.getState().calculType;
    const item              = useCraftStore.getState().item;
    const itemsPerMinute    = useCraftStore.getState().itemsPerMinute;
    const quantityFactories = useCraftStore.getState().quantityFactories;

    const setResults = useCraftStore.getState().setResults;

    if ( !item ) {
        return;
    }

    let crafts: ResultType[] = [];
    if ( calculType === 'quantity_factories' ) {
        const craft                    = findCraft( item );
        const firstIndexNotBlacklisted = craft.findIndex( ( craft ) => {
            return !getBlacklistedRecipes().includes( craft.id );
        } );

        if ( craft.length > 0 ) {
            const assemblerEfficiency     = 0.25;
            const itemPerMinutePerFactory = convertBaseTimeToItembyMinute( craft[ firstIndexNotBlacklisted ].base_time ) * craft[ firstIndexNotBlacklisted ].quantity * assemblerEfficiency;
            crafts                        = threeCrafts( item, [], itemPerMinutePerFactory * quantityFactories );
        }
    } else {
        crafts = threeCrafts( item, [], itemsPerMinute );
    }


    setResults( crafts );
}


export default calculate;
