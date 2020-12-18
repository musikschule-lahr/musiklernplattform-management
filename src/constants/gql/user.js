import { gql } from '@apollo/client';
import { UserFragments, RelationFragments } from './fragments';

export const GET_USER_BY_ID = gql`
  query User ($userId: Int!) {
    getUserFromId (
      where: {
        id: $userId
      }
    )
    {
      ...UserParts
      relatedTo {
        ...RelationKeyArgs
      }
      relatedBy {
        ...RelationKeyArgs
      }
    }
  }
  ${UserFragments.general}
  ${RelationFragments.keyArgs}
`;

export const GET_USER = gql`
  query User {
    getUser {
      ...UserParts
      relatedTo {
        ...RelationKeyArgs
      }
      relatedBy {
        ...RelationKeyArgs
      }
    }
  }
  ${UserFragments.general}
  ${RelationFragments.keyArgs}
`;

export const CAN_USE_MANAGEMENT = gql`
  query UserCanUseManagement {
    userCanUseManagement
  }
`;

export const GET_INSTRUMENTS = gql`
  query Instruments {
    getInstruments {
      idInstrument,
      id @client
      selected @client
      name,
    }
  }
`;

export const GET_INSTRUMENT_FROM_ID = gql`
  query Instrument ($instrumentId: Int!) {
    getInstrumentFromId (
      where: {
        id: $instrumentId
      }
    )
     {
      idInstrument,
      id @client
      name,
    }
  }
`;
export default {
  GET_USER,
  GET_USER_BY_ID,
  CAN_USE_MANAGEMENT,
  GET_INSTRUMENTS,
  GET_INSTRUMENT_FROM_ID,
};
