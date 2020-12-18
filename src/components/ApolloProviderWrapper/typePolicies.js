/* eslint-disable no-empty-pattern */
import { formatDate } from '~/constants/util';

export const typePolicies = {
  Query: {
    fields: {

      getPlans: {
        merge: false,
        plans: (existing) => {
          console.log('get plans', existing);
          if (existing) return existing;
          return [];
        },
      },

      getFavorites: {
        merge: false,
        read: (existing) => {
          if (existing) return existing;
          return [];
        },
      },
      filterLibElements: {
        merge: false,
      },
      getComposers: {
        merge: false,
      },
      getEpochs: {
        merge: false,
      },
      getInterpreters: {
        merge: false,
      },
      getInstruments: {
        merge: false,
      },
      getInstrumentations: {
        merge: false,
      },
    },
  },
  User: {
    keyFields: ['idUser'],
    fields: {
      id: (existing, { readField }) => `${readField('idUser')}`,
      fullname: (existing, { readField }) => `${readField('firstname')} ${readField('lastname')}`,
    },
  },
  Instrument: {
    keyFields: ['idInstrument'],
    fields: {
      id: (existing, { readField }) => `${readField('idInstrument')}`,
      selected: () => false,
    },
  },

  UserRelation: {
    keyFields: ['idCompound'],
    fields: {
      id: (existing, { readField }) => readField('idRelation'),
      type: () => 'user',
      name: (existing, { readField }) => {
        const related = readField('relatedUser');
        if (!related) return null;
        return `${readField('firstname', related)} ${
          readField('lastname', related)}`;
      },
      confirmedInstruments: {
        merge: false,
      },
      instruments: {
        merge: false,
      },
      groups: {
        merge: false,
      },
      confirmedGroups: {
        merge: false,
      },
    },
  },
  LibElement: {
    keyFields: ['idLibElement'],
    fields: {
      isFavorite: (existing) => (existing || false),
      instruments: {
        merge: false,
      },
    },
  },
  MetaData: {
    keyFields: ['idMetaData'],
  },
  Composer: {
    keyFields: ['idComposer'],
    fields: {
      firstname: (existing) => (existing || ''),
      lastname: (existing) => (existing || ''),
      selected: () => false,
    },
  },
  Interpreter: {
    keyFields: ['idInterpreter'],
    fields: {
      name: (existing) => (existing || ''),
      selected: () => false,
    },
  },
  Epoch: {
    keyFields: ['idEpoch'],
    fields: {
      selected: () => false,
    },
  },
  Instrumentation: {
    keyFields: ['idInstrumentation'],
    fields: {
      selected: () => false,
    },
  },
};

export default typePolicies;
