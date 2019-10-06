import React from "react";

const ApolloContext = React.createContext(null);

export const withApollo = Component => props => (
  <ApolloContext.Consumer>
    {apollo => <Component {...props} apollo={apollo} />}
  </ApolloContext.Consumer>
);

export default ApolloContext;
