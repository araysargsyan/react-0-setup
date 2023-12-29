import { type TypeFromConstValues } from 'config/store/lib/StateSetup/types';


const LoadingTypes = {
    Loading: 'LOADING',
    Suspense: 'SUSPENSE',
} as const;
const FlowStatuses = {
    Start: 'START',
    Setup: 'SETUP',
    SetupFirst: 'SETUP_FIRST'
} as const;
const RestartTypes = {
    OnAuth: 'ON_AUTH',
    AuthExpired: 'AUTH_EXPIRED',
} as const;
const RedirectionTypes = {
    ...RestartTypes,
    FirstRender: 'FIRST_RENDER',
    NotFirstRender: 'NOT_FIRST_RENDER'
} as const;

type TLoading = TypeFromConstValues<typeof LoadingTypes>;
type TFlowStatuses = TypeFromConstValues<typeof FlowStatuses>;
type TRestartTypes = TypeFromConstValues<typeof RestartTypes>;
type TRedirectionTypes = TypeFromConstValues<typeof RedirectionTypes>;


export {
    LoadingTypes,
    FlowStatuses,
    RestartTypes,
    RedirectionTypes,
    type TLoading,
    type TFlowStatuses,
    type TRestartTypes,
    type TRedirectionTypes
};
