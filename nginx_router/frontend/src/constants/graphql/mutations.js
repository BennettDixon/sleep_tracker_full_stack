import { gql } from "apollo-boost";

export const ADD_SLEEP_TIME = gql`
  mutation createSleepTime($sleepTime: SleepTimeInput!, $uid: String!) {
    createSleepTime(input: $programmer, uid: $uid) {
      ok
      sleepTime {
        id
        start
        stop
      }
    }
  }
`;
