import { type IStateSchema } from '../types';


export function createCanRefetch<
    S extends IStateSchema = IStateSchema,
    T extends((state: S) => boolean) = ((state: S) => boolean)
>(canRefetch: T) {
    return canRefetch as never as ((state: IStateSchema) => boolean);
}
