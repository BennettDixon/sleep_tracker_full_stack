import { gql } from "apollo-boost";

/////////////////
// PROGRAMMERS //
/////////////////
export const GET_PROGRAMMERS = gql`
  query Programmers {
    programmers {
      id
      username
      scaleRate
      lvl
      exp
      email
      badgeProgressions {
        id
        progressCount
        badge {
          name
        }
      }
      badgesEarned {
        name
        id
        progressRequirement
      }
      problemProgressions {
        id
        problem {
          id
          name
          containerImg
        }
        minutesSpent
        solved
        containerInstances {
          port
          id
        }
      }
      skillProgressions {
        id
        skill {
          name
        }
        lvl
        exp
      }
    }
  }
`;

export const GET_PROGRAMMER = gql`
  query Programmer($uidToken: String!) {
    programmer(uidToken: $uidToken) {
      id
      username
      email
      problemProgressions {
        problem {
          id
        }
        solved
        minutesSpent
        containerInstances {
          id
          containerId
          username
          password
          host
          port
        }
      }
      badgeProgressions {
        id
        progressCount
        badge {
          name
        }
      }
      badgesEarned {
        name
      }
      skillProgressions {
        exp
        lvl
        skill {
          name
        }
      }
    }
  }
`;

//////////////
// PROBLEMS //
//////////////
export const GET_PROBLEMS = gql`
  query Problems {
    problems {
      longDescription
      shortDescription
      id
      name
      skills {
        name
        longDescription
        shortDescription
        badges {
          name
          img
          progressText
          progressRequirement
        }
      }
    }
  }
`;

export const GET_PROBLEM = gql`
  query Problem($id: Int!) {
    problem(id: $id) {
      id
      name
      longDescription
      shortDescription
    }
  }
`;
