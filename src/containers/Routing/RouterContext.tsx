import React from 'react';
import { Route, Switch } from 'react-router-dom';

interface RouterContextProps<S, A = any> {
  state: S
  actions?: A
}

type RouterContextType<S> = React.Context<{
  state: S
  actions: any
  route: (path:string) => any
}>

export function RouterContext<S>(props: RouterContextProps<S,any>): [S, RouterContextType<S>] {
  const { state, actions } = props
  return [
    state, 
    React.createContext({
      route: (path: string) => path,
      actions,
      state,
    })
  ]
}

interface RouterProviderProps<S = any> {
  state: S
  actions: any
  context: RouterContextType<S>
  route?: string
  setRoute: (r:any) => any
  children: React.ReactNode
}

export function RouterProvider(
  { context, actions, state, route, setRoute, children }: RouterProviderProps
) {
  return (
    <Route render={({ history, match }) => {
      if (route) {
        if (route !== match.path)
          history.push(route)
        setRoute(undefined)
      }

      return (
        <context.Provider
          value={{
            route: history.push,
            state,
            actions,
          }}
        >
          <Switch>
            { children }
          </Switch>
        </context.Provider>
      )
    }}/>
  )
}

export default RouterContext
