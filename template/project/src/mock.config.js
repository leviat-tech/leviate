import locales from '@/locales';

export default {
  state: {},
  meta: {
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
      id: 'project_id',
      name: 'My Project',
      number: '1234',
      designer: 'John Doe',
      address: {
        street: '1234 Address Blvd',
        city: 'New York',
        country: 'USA',
        name: 'Shop Address',
        postcode: '12345',
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
    customer: {
      company: 'Fake Glazing Company',
      phone: '123-456-7890',
      firstName: 'John',
      lastName: 'Doe',
      email: 'glazing@company.com',
      address: {
        street: '1234 Address Blvd',
        postcode: '12345',
        city: 'New York',
        country: 'USA',
      },
    },
    origin: window.location.origin,

  },
  configuration: {
    "id": 1,
    "createdAt": "2023-10-15T10:13:34.729Z",
    "name": "My Configuration",
    "parentId": null,
    "state": {
      "example": "state"
    }
  },
};
