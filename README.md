# Next.js Project with Prisma and PostgreSQL

This project is a [Next.js](https://nextjs.org) application bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It integrates [Prisma](https://www.prisma.io/) as the ORM and uses [PostgreSQL](https://www.postgresql.org/) as the database.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

* [Node.js](https://nodejs.org/)
* [Docker](https://www.docker.com/get-started) (for database setup)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd your-repo-name
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

### Running the Development Server

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open your browser and navigate to:**

   [http://localhost:3000](http://localhost:3000)

   The application will automatically reload if you edit any files.

## Database Setup

This project uses PostgreSQL as its database, managed with Prisma.

### Using Docker

1. **Ensure Docker is running on your system.**

2. **Start the PostgreSQL database container:**

   ```bash
   docker-compose up -d
   ```

   This command will start the PostgreSQL database in a Docker container.

3. **Run database migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

   This will apply the migrations and set up the database schema.

4. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

   This command generates the Prisma Client, which allows for type-safe database queries.


### Without Docker

If you prefer to run PostgreSQL natively:

1. **Install PostgreSQL:**

   Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/).

2. **Create a new database:**

   ```bash
   createdb your-database-name
   ```

3. **Set up the `.env` file:**

   Create a `.env` file in the root of your project and add the following:

   ```env
   DATABASE_URL="postgresql://your-username:your-password@localhost:5432/your-database-name"
   ```

   Replace `your-username`, `your-password`, and `your-database-name` with your PostgreSQL credentials.

4. **Run migrations and generate Prisma Client:**

   Follow steps 3 and 4 from the Docker setup above.

## Project Structure

* `prisma/schema.prisma`: Prisma schema file defining the database models.

* `docker-compose.yml`: Configuration file for Docker to set up the PostgreSQL container.

## Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a font family from Vercel.

## Useful Commands

* **Start the development server:**

  ```bash
  npm run dev
  ```

* **Build the application for production:**

  ```bash
  npm run build
  ```

* **Start the production server:**

  ```bash
  npm run start
  ```

* **Run tests:**

  ```bash
  npm test
  ```

* **Lint the code:**

  ```bash
  npm run lint
  ```

## Learn More

To learn more about the technologies used in this project, check out the following resources:

* [Next.js Documentation](https://nextjs.org/docs) – learn about Next.js features and API.
* [Prisma Documentation](https://www.prisma.io/docs/) – learn about Prisma ORM and how to use it with Next.js.
* [PostgreSQL Documentation](https://www.postgresql.org/docs/) – official documentation for PostgreSQL.

## Acknowledgements

This project structure and setup were inspired by best practices and examples from the community, including:

* [Prisma's Next.js & Prisma Postgres Auth Starter](https://vercel.com/templates/next.js/prisma-postgres)&#x20;
* [Building a Full-Stack CRUD App with Next.js 14, Prisma, and PostgreSQL](https://dev.to/abdur_rakibrony_349a3f89/building-a-full-stack-crud-app-with-nextjs-14-prisma-and-postgresql-b3c)&#x20;

## License

This project is licensed under the [MIT License](LICENSE).

---

*Note: Replace placeholders like `your-username`, `your-repo-name`, and `your-database-name` with your actual project details.*
