import AlternativeRecipe from '@/type/AlternativeRecipe';

type ResultType = {
    id: string;
    output: string;
    items_per_minute: number;
    belts: number;
    quantity_factories: number;
    produced_in: string;
    recipes: AlternativeRecipe[];
    inputs: { item: string, quantity: number }[];
}

export default ResultType;
