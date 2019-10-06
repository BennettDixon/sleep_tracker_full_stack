import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";

import * as ROUTES from "../../constants/routes";
import * as QUERIES from "../../constants/graphql/queries";
import * as MUTATIONS from "../../constants/graphql/mutations";

class Apollo {
  constructor() {
    console.log("created apollo client");
    const uri = window.location.host + ROUTES.GRAPHQL_API;
    console.log("got graphql url: " + uri);
    this.cache = new InMemoryCache();
    this.client = new ApolloClient({
      uri: "http://" + uri,
      request: operation => {
        operation.setContext({
          headers: {
            uid_token: "test"
          }
        });
      },
      cache: this.cache
    });
  }

  //////////////////////////
  ////////* USERS *////////
  ////////////////////////
  getProgrammers = event =>
    this.client.query({
      query: QUERIES.GET_PROGRAMMERS
    });

  createProgrammer = (authUser, username, uidToken) =>
    this.client.mutate({
      mutation: MUTATIONS.ADD_PROGRAMMER,
      variables: {
        programmer: {
          email: authUser.email,
          username: username
        },
        uidToken: uidToken
      }
    });

  getProgrammer = uidToken =>
    this.client.query({
      query: QUERIES.GET_PROGRAMMER,
      variables: {
        uidToken: uidToken
      },
      fetchPolicy: "network-only"
    });

  /////////////////////////
  //////* PROBLEMS *//////
  ///////////////////////
  getProblems = () =>
    this.client.query({
      query: QUERIES.GET_PROBLEMS
    });

  getProblem = problemId =>
    this.client.query({
      query: QUERIES.GET_PROBLEM,
      variables: {
        id: problemId
      },
      fetchPolicy: "network-only"
    });
}

export default Apollo;
