import React, { createContext, useContext, useReducer } from "react";
import { Diagnosis, Entry, Patient } from "../types";

import { Action } from "./reducer";

export type State = {

  /*the state contains the patients array and the single patient we select*/

  patients: { [id: string]: Patient }, //a tuple, key-value pair
  patient:Patient|undefined,
  diagnosis:Diagnosis[],
  entry:Entry|undefined
};

const initialState: State = {
  patients: {},
  patient:undefined,
  diagnosis:[],
  entry:undefined
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
