import useCraftStore from '@/stores/craft_store';
import { AlternativeRecipe, CraftType, ResultType, ThreshType } from '@/app/page';

function convertBaseTimeToItembyMinute( baseTime: number ): number {
    return ( 60 / baseTime );
}


function findCraft( id: string ): CraftType[] {
    const crafts = require( '../data/v3/dist/craft.json' );

    return crafts.filter( ( craft: any ) => ( craft.output === id ) );
}

function findThresh( id: string ): ThreshType[] {
    const thresh = require( '../data/v3/dist/thresh.json' );

    return thresh.filter( ( craft: any ) => {
        return craft.outputs.find( ( output: any ) => output.item === id );
    } );
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
                          id:                 crypto.randomUUID(),
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


function threeCrafts( id: string, result: any[] = [], itemsPerMinuteNeeded = 1 ): ResultType[] {

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
        return !useCraftStore.getState().blacklistedRecipes.includes( craft.id );
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
        let shortRecipes: AlternativeRecipe[] = [];

        if ( craft.length > 1 ) {
            shortRecipes = craft.map( ( craft ) => {
                return {
                    id:     craft.id,
                    inputs: craft.inputs.map( ( input ) => input.item ),
                };
            } );
        }

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

        console.log( inputCraft );
        if ( inputCraft.length > 0 ) {

            const firstIndexInputNotBlacklisted = inputCraft.findIndex( ( craft ) => {
                return !useCraftStore.getState().blacklistedRecipes.includes( craft.id );
            } );

            // Si dans les inputs du craft on à le dernier output du dernier craft on stop afin de ne pas avoir de circulaire
            const findCirculare = inputCraft[ firstIndexInputNotBlacklisted ].inputs.find( ( input ) => input.item === craft[ firstIndexNotBlacklisted ].output );

            if ( findCirculare ) {
                console.log( `%c CIRCULAR FOR ${ input.item }`, 'background: #FFB122; color: #000000' );
                let shortRecipes: AlternativeRecipe[] = [];

                if ( inputCraft.length > 1 ) {
                    shortRecipes = inputCraft.map( ( craft ) => {
                        return {
                            id:     craft.id,
                            inputs: craft.inputs.map( ( input ) => input.item ),
                        };
                    } );
                }

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

            // On divise par deux car dans une assembleuse on produit 2 items par craft
            const itemsPerMinuteNeeded1 = input.quantity * itemsPerMinuteNeeded / 2;
            console.log( `NEDD ${ itemsPerMinuteNeeded1 } ${ input.item }` );
            threeCrafts( input.item, result, itemsPerMinuteNeeded1 );
        } else {
            const thresh = findThresh( input.item );
            if ( thresh.length > 0 ) {
                console.log( `%c IN THRESH`, 'background: #F600FF; color: #000000' );


                const firstIndexThreshNotBlacklisted = thresh.findIndex( ( craft ) => {
                    return !useCraftStore.getState().blacklistedRecipes.includes( craft.id );
                } );

                console.log( `Result for ${ input.item } : `, thresh[ firstIndexThreshNotBlacklisted ] );

                const inputPerMin = convertBaseTimeToItembyMinute( thresh[ firstIndexThreshNotBlacklisted ].base_time ) * useCraftStore.getState().thresherEfficiency;
                console.log( `input per minute = ${ inputPerMin } for ${ input.item }` );


                let outputQty = thresh[ firstIndexThreshNotBlacklisted ].outputs.find( ( output: any ) => output.item === input.item ).quantity;
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
            return !useCraftStore.getState().blacklistedRecipes.includes( craft.id );
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
