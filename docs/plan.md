# Finance Data Processing and Access Control Backend

## Objective
To evaluate your backend development skills through a practical assignment centered around API design, data modeling, business logic, and access control.

This assignment is intended to assess how you think about backend architecture, structure application logic, handle data correctly, and build reliable systems that are clear, maintainable, and logically organized.

> Note: If you have already built a similar backend project earlier, you may submit that project for evaluation. Please make sure to clearly explain how it matches this assignment and share the repository and, if available, the deployed API or documentation link.

---

## Key Instructions

- You are not required to follow a fixed project structure. Organize the backend in the way you believe is most appropriate.
- Focus on correctness, clarity, and maintainability.
- Reasonable assumptions are acceptable — document them clearly.
- Clean implementation matters more than size or complexity.

---

## Flexibility

You have full freedom to:

- Use any backend language, framework, or library
- Use any database (or even in-memory storage)
- Define your own schema and service structure
- Build REST, GraphQL, or any equivalent API
- Use mock authentication if needed

---

## Scenario

You are building the backend for a **finance dashboard system** where different users interact with financial records based on their role.

The system should support:

- Financial record management
- Role-based access
- Dashboard analytics

---

## Core Requirements

### 1. User and Role Management

Support:

- Creating and managing users
- Assigning roles
- Managing user status (active/inactive)
- Role-based restrictions

Example roles:

- **Viewer** → Read-only access
- **Analyst** → Read + insights
- **Admin** → Full access

---

### 2. Financial Records Management

Each record may include:

- Amount
- Type (income / expense)
- Category
- Date
- Notes

APIs should support:

- Create
- Read
- Update
- Delete
- Filtering (date, category, type)

---

### 3. Dashboard Summary APIs

Provide aggregated data:

- Total income
- Total expenses
- Net balance
- Category-wise totals
- Recent activity
- Trends (monthly/weekly)

---

### 4. Access Control Logic

Enforce role-based permissions:

- Viewer → cannot modify data
- Analyst → read + analytics
- Admin → full access

Implementation options:

- Middleware
- Guards
- Policies
- Decorators

---

### 5. Validation and Error Handling

Ensure:

- Input validation
- Clear error messages
- Proper HTTP status codes
- Protection against invalid operations

---

### 6. Data Persistence

Use any:

- Relational DB (Postgres, MySQL)
- Document DB (MongoDB)
- SQLite
- In-memory (if justified)

> Clearly document your choice.

---

## Optional Enhancements

- Authentication (JWT / sessions)
- Pagination
- Search
- Soft deletes
- Rate limiting
- Tests (unit/integration)
- API documentation

---

## Evaluation Criteria

### 1. Backend Design
Structure, modularity, separation of concerns

### 2. Logical Thinking
Business rules and access control clarity

### 3. Functionality
Correctness and consistency of APIs

### 4. Code Quality
Readability, naming, organization

### 5. Data Modeling
Efficiency and correctness of schema

### 6. Validation & Reliability
Handling of edge cases and errors

### 7. Documentation
README clarity, setup steps, assumptions

### 8. Thoughtfulness
Extra improvements and design decisions

---

## Important Note

This is **not a production system requirement**.

Focus on:

- Clear thinking
- Clean design
- Strong fundamentals

A well-structured, thoughtful solution is far more valuable than unnecessary complexity.