import {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
  createAction,
  createReducer,
} from "@reduxjs/toolkit";
import { rootReducer } from "./root-reducer";
import { UserEntity } from "./auth/user.entity";
import { PropertyEntity } from "./properties/property.entity";
import { OnboardingFormData } from "./onboarding/onboarding.slice";

const initialState = rootReducer(undefined, createAction("")());

const withAuthUser = createAction<UserEntity>("withAuthUser");
const withAuthChecked = createAction("withAuthChecked");
const withProperties = createAction<PropertyEntity>("withProperties");
const withOnBoardingForm =
  createAction<OnboardingFormData>("withOnBoardingForm");
const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(withAuthUser, (state, action) => {
      state.auth.user = action.payload;
    })
    .addCase(withAuthChecked, (state) => {
      state.auth.isChecked = true;
    })
    .addCase(withProperties, (state, action) => {
      if (!state.properties.entities) {
        state.properties.entities = {};
      }
      state.properties.entities[action.payload.id] = action.payload;
    });
  builder.addCase(withOnBoardingForm, (state, action) => {
    state.onboarding.formData = action.payload;
  });
});

export const stateBuilder = (state = initialState) => {
  const reduce =
    <P>(action: ActionCreatorWithPayload<P>) =>
    (payload: P) =>
      stateBuilder(reducer(state, action(payload)));

  const reduceWitoutPayload = (action: ActionCreatorWithoutPayload) => () =>
    stateBuilder(reducer(state, action()));

  return {
    withAuthUser: reduce(withAuthUser),
    withAuthChecked: reduceWitoutPayload(withAuthChecked),
    withProperties: reduce(withProperties),
    withOnBoardingForm: reduce(withOnBoardingForm),
    build: () => state,
  };
};

export const stateBuilderProvider = () => {
  let builder = stateBuilder();
  return {
    getState() {
      return builder.build();
    },
    setState(updateFn: (_builder: StateBuilder) => StateBuilder) {
      builder = updateFn(builder);
    },
  };
};

export type StateBuilder = ReturnType<typeof stateBuilder>;
export type StateBuilderProvider = ReturnType<typeof stateBuilderProvider>;
