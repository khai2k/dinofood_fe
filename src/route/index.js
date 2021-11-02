import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'

import routes from '_route/config'
import { ensureArray } from '_utils/helpers'
import { setStorage } from '_utils/storage'
import { getIsAuthenticatedSelector } from '_store/selectors/auth'

import Layout from '_layout'
import Loading from '_components/Loading'
// import SnowStorm from '_components/SnowStorm'
import AlertComponent from '_components/AlertComponent'
import generate from './generate'

const AuthRoute = ({ component: Component, ...props }) => {
  const location = useLocation()
  const isAuthenticated = useSelector(getIsAuthenticatedSelector)

  return (
    <Route
      {...props}
      render={routeProps => {
        if (isAuthenticated) {
          return <Component {...routeProps}/>
        }

        setStorage('auth-redirect', `${location.pathname}${location.search}`)
        return <Redirect to={generate('login')}/>
      }}
    />
  )
}

const Routes = props => {
  const isAuthenticated = useSelector(getIsAuthenticatedSelector)

  return (
    <>
      {/* <SnowStorm /> */}
      <AlertComponent />
      <Loading show={isAuthenticated === null}/>

      {isAuthenticated !== null && (
        <Layout>
          <Switch>
            {ensureArray(routes).map(item => {
              const exact = Boolean(item.exact)
              const RenderComponent = item.component

              // default route required auth
              if (item.auth !== false) {
                return (
                  <AuthRoute
                    key={item.path}
                    path={item.path}
                    exact={exact}
                    component={RenderComponent}
                  />
                )
              }

              return (
                <Route
                  key={item.path}
                  path={item.path}
                  exact={exact}
                  component={RenderComponent}
                />
              )
            })}
          </Switch>
        </Layout>
      )}
    </>
  )
}

export default Routes
