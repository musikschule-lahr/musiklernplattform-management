import { gql } from '@apollo/client';

export const UserFragments = {
  general: gql`
    fragment UserParts on User {
      idUser,
      id @client,
      firstname,
      lastname,
      username,
      mail,
      phone,
      birthyear,
      matrixUserName
      instruments {
        idInstrument,
        id @client,
        name
      }
      teachedInstruments {
        idInstrument,
        id @client,
        name
      }
    }
  `,
};
export const RelationFragments = {
  general: gql`
      fragment RelationParts on UserRelation {
        idRelation
        idCompound
        id @client
        isConfirmed
        userRole
        relatedUserRole
        confirmedInstruments
        confirmedGroups
        matrixRoomId
        instruments {
          idInstrument
          id @client
          name
        },
        groups {
          idGroup
          id @client
          name
          matrixRoomId
        }
        user {
          idUser
          id @client
          firstname
          lastname
          matrixUserName
        }
        relatedUser{
          idUser
          id @client
          firstname
          lastname
          matrixUserName
        }
        name @client,
        type @client
      }`,
  withoutUsers: gql`
       fragment RelationPartsWithoutUsers on UserRelation {
         idRelation
        idCompound
         id @client
         isConfirmed
         userRole
         relatedUserRole
         confirmedInstruments
         confirmedGroups
         matrixRoomId
         instruments {
           idInstrument
           id @client
           name
         },
         groups {
           idGroup
           id @client
           name
           matrixRoomId
         }
         name @client,
         type @client
       }`,
  keyArgs: gql`
      fragment RelationKeyArgs on UserRelation {
        idRelation
        idCompound
        id @client
        userRole
        relatedUserRole
        user {
            idUser
            id @client
            firstname
            lastname
            matrixUserName
        }
        relatedUser{
          idUser
          id @client
          firstname
          lastname
          matrixUserName
        }
      }
    `,
};



export default { UserFragments };
