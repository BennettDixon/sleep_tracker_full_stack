import { gql } from "apollo-boost";

/////////////////
// PROGRAMMERS //
/////////////////
export const GET_USER_SLEEP_TIMES = gql`
  query UserSleepTimes($uid: String!) {
    userSleepTimes(uid: $uid) {
      id
      start
      stop
    }
  }
`;
