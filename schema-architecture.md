This Spring Boot application uses both MVC and REST controllers. Thymeleaf templates are used to serve the Admin and Doctor dashboards, providing server-rendered HTML pages. REST APIs are provided for other modules such as appointments and patient records, enabling scalable integration with external clients. The backend interacts with two databases: MySQL stores structured data including patients, doctors, appointments, and admins, managed via Spring Data JPA; MongoDB handles unstructured prescription data via Spring Data MongoDB. All controller requests are routed through a common service layer that implements business logic and delegates data access to appropriate repositories.




User accesses the system through either Thymeleaf-based dashboards (Admin, Doctor) or via REST API clients (mobile apps, frontend modules).

User requests are routed to the backend controllers: MVC controllers handle Thymeleaf views, REST controllers process JSON API requests.

Controllers validate incoming requests and forward them to the service layer containing business logic.

The service layer applies rules, coordinates workflows, and interacts with data repositories.

The repository layer accesses the underlying databases: MySQL via JPA for structured data, MongoDB for document-based data like prescriptions.

Retrieved data is mapped into Java model objects (@Entity for MySQL, @Document for MongoDB) for application use.

Controllers return data back to clients as rendered HTML pages (Thymeleaf) or JSON responses (REST), completing the request-response cycle.

