import CraftType from '@/type/CraftType';
import { findCraft, findDrill, findThresh, getBlacklistedRecipes, threeCrafts } from '@/lib/calculator';
import ThreshType from '@/type/ThreshType';
import DrillType from '@/type/DrillType';

describe( 'findCraft function', () => {
    it( 'returns all crafts with matching output', () => {
        const crafts: CraftType[] = findCraft( 'Accumulator' );
        expect( crafts ).toEqual( [
                                      {
                                          'id':          'Accumulator_1',
                                          'output':      'Accumulator',
                                          'quantity':    '1',
                                          'inputs':      [
                                              {
                                                  'item':     'Copper_Frame',
                                                  'quantity': '6',
                                              },
                                              {
                                                  'item':     'Electric_Component',
                                                  'quantity': '20',
                                              },
                                              {
                                                  'item':     'Kindlevine_Extract',
                                                  'quantity': '20',
                                              },
                                          ],
                                          'base_time':   '12.0',
                                          'produced_in': 'Assembler',
                                      },
                                  ] );

        const crafts2: CraftType[] = findCraft( 'Iron_Frame' );
        expect( crafts2 ).toEqual( [
                                       {
                                           'id':          'Iron_Frame_1',
                                           'output':      'Iron_Frame',
                                           'quantity':    '1',
                                           'inputs':      [
                                               {
                                                   'item':     'Iron_Ingot',
                                                   'quantity': '6',
                                               },
                                           ],
                                           'base_time':   '3.0',
                                           'produced_in': 'Assembler',
                                       },
                                       {
                                           'id':          'Iron_Frame_2',
                                           'output':      'Iron_Frame',
                                           'quantity':    '40',
                                           'inputs':      [
                                               {
                                                   'item':     'Iron_Slab',
                                                   'quantity': '10',
                                               },
                                           ],
                                           'base_time':   '120.0',
                                           'produced_in': 'Assembler',
                                       },
                                   ] );


    } );

    it( 'returns an empty array when no crafts match the given output', () => {
        const crafts: CraftType[] = findCraft( 'nonexistent' );
        expect( crafts ).toEqual( [] );
    } );
} );

describe( 'findThresh function', () => {
    it( 'returns all threshes with matching output', () => {
        const threshes: ThreshType[] = findThresh( 'Atlantum_Ingot' );
        expect( threshes ).toEqual( [
                                        {
                                            'id':        'Atlantum_Slab',
                                            'input':     'Atlantum_Slab',
                                            'outputs':   [
                                                {
                                                    'item':     'Atlantum_Ingot',
                                                    'quantity': '25',
                                                },
                                            ],
                                            'base_time': '1.0',
                                        },
                                    ] );

        const threshes2: ThreshType[] = findThresh( 'Atlantum_Powder' );
        expect( threshes2 ).toEqual( [
                                         {
                                             'id':        'Atlantum_Chunk',
                                             'input':     'Atlantum_Chunk',
                                             'outputs':   [
                                                 {
                                                     'item':     'Clay',
                                                     'quantity': '6',
                                                 },
                                                 {
                                                     'item':     'Atlantum_Powder',
                                                     'quantity': '25',
                                                 },
                                             ],
                                             'base_time': '60.0',
                                         },
                                         {
                                             'id':        'Atlantum_Ore',
                                             'input':     'Atlantum_Ore',
                                             'outputs':   [
                                                 {
                                                     'item':     'Atlantum_Powder',
                                                     'quantity': '1',
                                                 },
                                             ],
                                             'base_time': '2.0',
                                         },
                                         {
                                             'id':        'Infused_Atlantum',
                                             'input':     'Infused_Atlantum',
                                             'outputs':   [
                                                 {
                                                     'item':     'Atlantum_Powder',
                                                     'quantity': '4',
                                                 },
                                                 {
                                                     'item':     'Limestone',
                                                     'quantity': '6',
                                                 },
                                             ],
                                             'base_time': '9.0',
                                         },
                                     ] );

    } );

    it( 'returns an empty array when no threshes match the given output', () => {
        const threshes: ThreshType[] = findThresh( 'nonexistent' );
        expect( threshes ).toEqual( [] );
    } );
} );

describe( 'findDrill function', () => {
    it( 'returns all drills with matching output', () => {
        const drills: DrillType[] = findDrill( 'Iron_Ore' );
        expect( drills ).toEqual( [
                                      {
                                          'id':          'Iron_Ore_1',
                                          'output':      'Iron_Ore',
                                          'quantity':    '1',
                                          'inputs':      [],
                                          'base_time':   1,
                                          'produced_in': 'Drill',
                                      },
                                  ] );
    } );

    it( 'returns an empty array when no drills match the given output', () => {
        const drills: DrillType[] = findDrill( 'nonexistent' );
        expect( drills ).toEqual( [] );
    } );
} );

jest.mock( '../../stores/craft_store', () => ( {
    getState: jest.fn( () => ( {
        blacklistedRecipes: [
            'Iron_Ingot_2',
            'Iron_Ingot_3',
            'Iron_Ingot_4',
            'Iron_Frame_2',
            'Infused_Iron',
            'Iron_Chunk',
        ],
    } ) ),
} ) );


describe( 'threeCrafts function', () => {
    it( 'should mock getBlacklistedRecipes', () => {
        const blacklistedRecipes = getBlacklistedRecipes();
        expect( blacklistedRecipes ).toEqual(
            [
                'Iron_Ingot_2',
                'Iron_Ingot_3',
                'Iron_Ingot_4',
                'Iron_Frame_2',
                'Infused_Iron',
                'Iron_Chunk',
            ],
        );
    } );

    it( 'return all items for  Mining Drill', function () {
        const res = threeCrafts( 'Mining_Drill', [], 5 );
        expect( res[ 0 ].output ).toBe( 'Mining_Drill' );
        expect( res[ 0 ].items_per_minute ).toBe( 5 );

        expect( res[ 1 ].output ).toBe( 'Iron_Frame' );
        expect( res[ 1 ].items_per_minute ).toBe( 7.5 );

        expect( res[ 2 ].output ).toBe( 'Iron_Ingot' );
        expect( res[ 2 ].items_per_minute ).toBe( 72.5 );

        expect( res[ 3 ].output ).toBe( 'Iron_Ore' );
        expect( res[ 3 ].items_per_minute ).toBe( 145 );

        expect( res[ 4 ].output ).toBe( 'Iron_Component' );
        expect( res[ 4 ].items_per_minute ).toBe( 50 );
    } );
} );
