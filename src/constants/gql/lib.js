import { gql } from '@apollo/client';

export const LIB_ELEMENT_FRAGMENT = gql`
  fragment LibElementParts on LibElement {
    idLibElement
    productionNo
    playerPath
    playerType
    createdAt
    updatedAt
    author {
      idUser
      firstname
      lastname
    }
    instruments{
      idInstrument
      id @client
      name
    }
    categories{
      idCategory
      name
    }
    tracks{
      idTrack
      title
      isVideo
      filePath
      sorting
    }
    metaData {
      idMetaData
      title
      shortTitle
      comment
      movement
      difficultyMin
      difficultyMax
      coverImagePath
      yearOfRecording
      tuning
      composer {
        idComposer
        firstname
        lastname
        yearOfBirth
        yearOfDeath
      }
      interpreter{
          idInterpreter
          name
        }
      epoch {
        idEpoch
        code
        description
      }
      instrumentation{
       idInstrumentation
       name
      }
    }
  }`;

export const GET_LIB_ELEMENTS = gql`
query FilterLibElements(
  $title: String
){
  filterLibElements(
      filter: {
        title: $title
      }
      )
    {
     ...LibElementParts
    }
}
${LIB_ELEMENT_FRAGMENT}
`;

export const ADD_LIB_ELEMENT = gql`
mutation AddLibElement(
    $playerType: String!
    $productionNo: String!
    $metadata: MetaDataCreateInput!
    $instruments: [InstrumentInput]
    $categories: [CategoryInput]
){
  addLibElement(
      data: {
        playerType: $playerType
        productionNo: $productionNo
        metadata: $metadata
        instruments: $instruments
        categories: $categories
      }
    )
    {
     ...LibElementParts
    }
}
${LIB_ELEMENT_FRAGMENT}
`;
export const EDIT_LIB_ELEMENT = gql`
  mutation EditLibElement(
    $idLibElement: Int!
    $productionNo: String
    $playerType: String
    $metadata: MetaDataUpdateInput
    $instruments: [InstrumentInput]
    $categories: [CategoryInput]
  ){
    updateLibElement(
    where: { id: $idLibElement }
    data: {
      playerType: $playerType
      productionNo: $productionNo
      metadata: $metadata
      instruments: $instruments
      categories: $categories
    }
    )
    {
    ...LibElementParts
    }
  }
${LIB_ELEMENT_FRAGMENT}
`;
export const SEARCH_LIB_ELEMENTS = gql`
query SearchLibElements(
  $text: String
  $difficulty: DifficultyInput
  $instruments: [InstrumentInput]
  $epochs: [EpochInput]
  $sorting: LibElementSortableInput
){
  filterLibElements(
      filter: {
        title: $text
        composer:{
          firstname: $text
          lastname: $text
        }
        interpreter: {
          name: $text
        }
        comment: $text
        difficulty: $difficulty
        instruments: $instruments
        epochs: $epochs
      }
      sorting: $sorting
      )
    {
     ...LibElementParts
    }
}
${LIB_ELEMENT_FRAGMENT}
`;

export const GET_LIB_ELEMENT_FROM_PATH = gql`
query GetLibElementFromPath(
  $path: String!
){
  getLibElementFromPath(
      where: {
        pathId: $path
      }
      )
    {
     ...LibElementParts
    }
}
${LIB_ELEMENT_FRAGMENT}
`;

export const GET_COMPOSERS = gql`
query GetComposers{
  getComposers
    {
      idComposer
      firstname
      lastname
      yearOfBirth
      yearOfDeath
      selected @client
    }
}
`;
export const GET_EPOCHS = gql`
query GetEpochs{
  getEpochs
    {
          idEpoch
          code
          description
          selected @client
    }
}
`;
export const GET_INSTRUMENTATIONS = gql`
query GetInstrumentations{
  getInstrumentations
    {
          idInstrumentation
          name
          selected @client
    }
}
`;
export const GET_INTERPRETERS = gql`
query GetInterpreters{
  getInterpreters
    {
      idInterpreter
      name
      selected @client
    }
}
`;
export const ADD_EPOCH = gql`
mutation AddEpoch(
  $code: String!
  $description: String!)
  {
  addEpoch(
    data: {
     code: $code
     description: $description
   })
    {
          idEpoch
          code
          description
          selected @client
    }
}
`;
export const UPDATE_EPOCH = gql`
mutation UpdateEpoch(
    $id: Int!
    $code: String
    $description: String
  )
  {
 updateEpoch(
     where:{
       id: $id
     }
     data: {
    code: $code
    description: $description
  })
    {
          idEpoch
          code
          description
          selected @client
    }
}
`;
export const REMOVE_EPOCH = gql`
mutation RemoveEpoch(
  $id: Int!
){
  removeEpoch(
    where: {
      id: $id
    }
  )
}
`;

export const ADD_INSTRUMENTATION = gql`
mutation AddInstrumentation(
  $name: String!
  )
  {
  addInstrumentation(
    data: {
      name: $name
   })
    {
      idInstrumentation
          name
          selected @client
    }
}
`;
export const UPDATE_INSTRUMENTATION = gql`
mutation UpdateInstrumentation(
    $id: Int!
    $name: String
  )
  {
 updateInstrumentation(
     where:{
       id: $id
     }
     data: {
      name: $name
  })
    {
          idInstrumentation
          name
          selected @client
    }
}
`;
export const REMOVE_INSTRUMENTATION = gql`
mutation RemoveInstrumentation(
  $id: Int!
){
  removeInstrumentation(
    where: {
      id: $id
    }
  )
}
`;
export const ADD_COMPOSER = gql`
mutation AddComposer(
  $firstname: String!
  $lastname: String!
  $yearOfBirth: Int
  $yearOfDeath: Int
){
  addComposer(
    data: {
      firstname: $firstname
      lastname: $lastname
      yearOfBirth: $yearOfBirth
      yearOfDeath: $yearOfDeath
    }
  )
    {
      idComposer
      firstname
      lastname
      yearOfBirth
      yearOfDeath
      selected @client
    }
}
`;

export const UPDATE_COMPOSER = gql`
mutation UpdateComposer(
  $id: Int!
  $firstname: String
  $lastname: String
  $yearOfBirth: Int
  $yearOfDeath: Int
){
  updateComposer(
    where: {
      id: $id
    }
    data: {
      firstname: $firstname
      lastname: $lastname
      yearOfBirth: $yearOfBirth
      yearOfDeath: $yearOfDeath
    }
  )
    {
      idComposer
      firstname
      lastname
      yearOfBirth
      yearOfDeath
      selected @client
    }
}
`;
export const REMOVE_COMPOSER = gql`
mutation RemoveComposer(
  $id: Int!
){
  removeComposer(
    where: {
      id: $id
    }
  )
}
`;

export const ADD_INTERPRETER = gql`
mutation AddInterpreter(
  $name: String!
){
  addInterpreter(
    data: {
      name: $name
    }
  )
    {
      idInterpreter
      name
      selected @client
    }
}
`;

export const UPDATE_INTERPRETER = gql`
mutation UpdateInterpreter(
  $id: Int!
  $name: String
){
  updateInterpreter(
    where: {
      id: $id
    }
    data: {
      name: $name
    }
  )
    {
      idInterpreter
      name
      selected @client
    }
}
`;
export const REMOVE_INTERPRETER = gql`
mutation RemoveInterpreter(
  $id: Int!
){
  removeInterpreter(
    where: {
      id: $id
    }
  )
}
`;

export const ADD_TRACK = gql`
mutation AddTrack(
  $libElementId: Int!
  $title: String!
  $isVideo: Boolean!
  $sorting: Int!
){
  addTrack(
    libElement:{
      id: $libElementId
    }
    data: {
      title: $title
      isVideo: $isVideo
      sorting: $sorting
    }
  )
    {
      idTrack
      title
      isVideo
      filePath
      sorting
    }
}
`;

export const UPDATE_TRACK = gql`
mutation UpdateTrack(
  $id: Int!
  $title: String
  $filePath: String
  $sorting: Int
){
  updateTrack(
    where: {
      id: $id
    }
    data: {
      title: $title
      filePath: $filePath
      sorting: $sorting
    }
  )
    {
      idTrack
      title
      isVideo
      filePath
      sorting
    }
}
`;
export const REMOVE_TRACK = gql`
mutation RemoveTrack(
  $id: Int!
){
  removeTrack(
    where: {
      id: $id
    }
  )
}
`;

export const REMOVE_COVER_FILE = gql`
mutation RemoveCoverFile(
  $id: Int!
){
  removeCoverFile(
    where: {
      id: $id
    }
  )
}
`;
export const REMOVE_TRACK_FILE = gql`
mutation RemoveTrackFile(
  $id: Int!
){
  removeTrackFile(
    where: {
      id: $id
    }
  )
  {
      idTrack
      title
      isVideo
      filePath
      sorting
    }
}
`;

export const GET_INSTRUMENTS = gql`
  query Instruments {
    getInstruments {
      idInstrument,
      selected @client
      name
      icon
      instrumentGroup
    }
  }
`;
export const ADD_INSTRUMENT = gql`
mutation AddInstrument(
  $name: String!
  $icon: String
  $instrumentGroup: String
  )
  {
  addInstrument(
    data: {
      name: $name
      icon: $icon
      instrumentGroup: $instrumentGroup
    })
    {
      idInstrument,
      selected @client
      name
      icon
      instrumentGroup
    }
}
`;
export const UPDATE_INSTRUMENT = gql`
mutation UpdateInstrument(
    $id: Int!
    $name: String
    $icon: String
    $instrumentGroup: String
  )
  {
  updateInstrument(
      where:{
        id: $id
      }
      data: {
        name: $name
        icon: $icon
        instrumentGroup: $instrumentGroup
    })
    {
      idInstrument,
      selected @client
      name
      icon
      instrumentGroup
    }
}
`;
export const REMOVE_INSTRUMENT = gql`
mutation RemoveInstrument(
  $id: Int!
){
  removeInstrument(
    where: {
      id: $id
    }
  )
}
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      idCategory,
      selected @client
      name
      parent {
        idCategory,
        name
      }
      children {
        idCategory,
        name
      }
    }
  }
`;
export const ADD_CATEGORY = gql`
mutation AddCategory(
  $name: String!
  )
  {
  addCategory(
    data: {
      name: $name
    })
    {
      idCategory,
      selected @client
      name
      parent {
        idCategory,
        name
      }
      children {
        idCategory,
        name
      }
    }
}
`;
export const UPDATE_CATEGORY = gql`
mutation UpdateCategiry(
    $id: Int!
    $name: String
  )
  {
  updateCategory(
      where:{
        id: $id
      }
      data: {
        name: $name
    })
    {
      idCategory,
      selected @client
      name
      parent {
        idCategory,
        name
      }
      children {
        idCategory,
        name
      }
    }
}
`;
export const REMOVE_CATEGORY = gql`
mutation RemoveCategory(
  $id: Int!
){
  removeCategory(
    where: {
      id: $id
    }
  )
}
`;
export default {
  GET_LIB_ELEMENTS, GET_LIB_ELEMENT_FROM_PATH,
};
