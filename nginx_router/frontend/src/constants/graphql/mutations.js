import { gql } from "apollo-boost";

export const ADD_SLEEP_TIME = gql`
  mutation createSleepTime($uid: Int!, $sleepTime: SleepTimeInput!) {
    createSleepTime(uid: $uid, input: $sleepTime) {
      ok
      sleepTime {
        id
        start
        stop
      }
    }
  }
`;
