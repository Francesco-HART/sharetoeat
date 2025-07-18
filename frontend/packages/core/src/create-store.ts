import {
    type Action,
    type ThunkDispatch,
    configureStore,
    createListenerMiddleware,
} from "@reduxjs/toolkit";
import type { AuthGateway } from "./auth/ports/auth.gateway";
import { rootReducer } from "./root-reducer";
import { onAuthStateChangedListener } from "./auth/listeners/on-auth-state-changed.listener";
import { FakeAuthGateway } from "./auth/adapters/fake-auth.gateway";

export type Dependencies = {
    authGateway: AuthGateway;
};

export const createStore = (
    dependencies: Dependencies,
    preloadedState?: Partial<RootState>,
) => {
    createListenerMiddleware<RootState, AppDispatch, Dependencies>({
        extra: dependencies,
    });

    const store = configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: dependencies,
                },
            }),
    });

    onAuthStateChangedListener({ store, authGateway: dependencies.authGateway });

    return store;
};

export const createTestStore = (
    { authGateway = new FakeAuthGateway() }: Partial<Dependencies> = {},
    preloadedState?: Partial<RootState>,
) => {
    return createStore(
        {
            authGateway,
        },
        preloadedState,
    );
};

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, Action<any>>;
export type RootState = ReturnType<typeof rootReducer>;
