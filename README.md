<!-- ABOUT THE PROJECT -->

## About The Project

This is a Service API repository for Football Quiz. This Restful API is built using ExpressJS and PostgreSQL.

### Technology Used

- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [JWT](https://jwt.io/)

## Getting Started

### Installation

- Clone this project with `git clone https://github.com/useSreel-developers/football-quiz-express.git`
- Install package required with `yarn`
- Setting .env

```bash
NODE_ENV=
PORT=

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

GOOGLE_CLIENT_ID=
```

- Migrate database using `yarn run migrate:up`

### Executing program

- Run program with `yarn run dev` for development and `yarn run start` for production (must be compiled first with `yarn run compile`)

<!-- RELATED PROJECT -->

## Related Project

- [Football Quiz App Mobile](https://github.com/useSreel-developers/football-quiz-mobile.git)

## Authors

Contributors names and contact info:

1. Andry Pebrianto

- [Linkedin](https://www.linkedin.com/in/andry-pebrianto)

## License

This project is licensed under the MIT License - see the LICENSE file for details
