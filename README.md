#Events & Ticketing System 🎟️

A full-stack microservices-based application for managing events and ticket purchases. This project provides a user-friendly platform for event discovery, real-time ticket reservations, and secure order processing. It also includes an intuitive admin back-office for efficient event management.


#User Features:
Browse events and view detailed descriptions.
Real-time ticket reservation with a 2-minute locking mechanism.
Secure ticket purchasing with order summaries and confirmations.
User profile for viewing purchase history and nearest upcoming events.

#Admin Features:
Back-office for creating, editing, and managing events.
Monitoring of ticket availability and user comments.
Role-based access control for administrators, managers, and workers.

#System Highlights:
Scalable microservices architecture for high availability.
Asynchronous communication between services via RabbitMQ.
Secure authentication with JWT and role-based access control.
Optimized database querying for large datasets in MongoDB.
Cloud deployment with 99.9% uptime.
Tech Stack

#Frontend:
React.js
React Query for data synchronization
CSS for responsive styling

#Backend:
Node.js
Express.js
RabbitMQ for message brokering
MongoDB for data storage

#Security:
JWT for authentication
XSS and CSRF protection

#Deployment:
Cloud-hosted infrastructure with load balancing
System Architecture


The system follows a microservices-based architecture with dedicated services for Events, Orders, and API Gateway. Services communicate asynchronously using RabbitMQ, ensuring seamless data flow and minimal latency.


Usage

Users: Sign up, browse events, select tickets, and proceed to checkout.
Admins: Log into the back-office to manage events and monitor ticket sales.

enter the following link : https://events-ticketing-system-mahmoud.onrender.com

