/**
 * Created by nandral on 10/03/2017.
 */
export const schema = {
  "type": "object",
  "properties": {
    "users": {
      "type": "array",
      "minItems": 10,
      "maxItems": 10,
      "items": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string",
            "faker": "name.firstName"
          },
          "lastName": {
            "type": "string",
            "faker": "name.lastName",
          },
          "email": {
            "type": "string",
            "faker": "internet.email",
          },
          "dateOfBirth": {
            "type": "string",
            "faker": "date.past",
          }
        },
        required: ['firstName', 'lastName', 'email','dateOfBirth']
      }
    },

    "tasks": {
      "type": "array",
      "minItems": 10,
      "maxItems": 10,
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "faker": "name.jobTitle"
          },
          "description": {
            "type": "string",
            "faker": "lorem.sentence",
          },
          "durationInMins": {
            "type": "number",
            "faker": "random.number",
          }
        },
        required: ['title', 'description', 'durationInMins']
      }
    }

  },
  required: ['users','tasks']
};
