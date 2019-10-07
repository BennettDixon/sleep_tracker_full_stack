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
  // TODO in production uid should really be uidToken and authenticate with JRT tokens

  getUserSleepTimes = uid =>
    this.client.query({
      query: QUERIES.GET_USER_SLEEP_TIMES,
      variables: {
        uid: uid
      },
      // network only for this because we need to grab latest info from server, disregarding cache
      fetchPolicy: "network-only"
    });

  createSleepTime = (uid, sleepTime) =>
    this.client.mutate({
      mutation: MUTATIONS.ADD_SLEEP_TIME,
      variables: {
        uid: uid,
        sleepTime: sleepTime
      }
    });

  deleteSleepTime = (uid, id) =>
    this.client.mutate({
      mutation: MUTATIONS.DEL_SLEEP_TIME,
      variables: {
        uid: uid,
        id: id
      }
    });
}

export default Apollo;
