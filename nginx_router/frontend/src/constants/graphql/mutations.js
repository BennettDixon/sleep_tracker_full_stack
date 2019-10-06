import { gql } from "apollo-boost";

export const ADD_PROGRAMMER = gql`
  mutation createProgrammer($programmer: ProgrammerInput!, $uidToken: String!) {
    createProgrammer(input: $programmer, uidToken: $uidToken) {
      ok
      programmer {
        username
      }
    }
  }
`;
