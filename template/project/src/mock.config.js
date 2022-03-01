import locales from '@/locales';

export default {
  configurator: {
    schema: {},
    name: '{{ TITLE }}',
    dictionary: locales,
    documentTemplates: [
      {
        id: 1,
        name: 'Overview',
        format: 'pdf',
        meta: {
          template: 'overview',
        },
        dictionary: {
          en: {
            key: 'Value',
          },
        },
      },
    ],
  },

  project: {
    name: 'My Project',
    account: {
      name: 'Fake Glazing Company',
    },
    address: {
      address: '1234 Address Blvd',
      city: 'New York',
      country: 'USA',
      name: 'Shop Address',
      postalCode: '12345',
    },
    assignments: [
      { id: 1, userId: 3 },
    ],
    users: [
      { id: 3, name: 'Chris Gaines' },
    ],
  },

  user: {
    name: 'Wilt Chamberlain',
    locale: 'en',
    role: {
      name: 'admin',
    },
  },

  company: {
    name: 'CRH Technology Studio',
  },
};
