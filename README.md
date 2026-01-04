# EventWisp Fullstack

EventWisp is a fullstack event management application with a Spring Boot backend and a Next.js frontend. The platform focuses on streamlined event operations, including attendee access via QR codes and reporting for event analytics.

## Backend Tech Stack (Introduction)
The backend is built with **Spring Boot 3 (Java 17)**, using **Spring Web** for REST APIs and **Spring Data JPA** for database access. Authentication is handled via **Spring Security** with **JWT** support. The service integrates **MySQL** for production data storage and **H2** for testing, and includes integrations for **Stripe payments** and **email delivery** via Spring Mail.

## Frontend Tech Stack (Introduction)
The frontend is a **Next.js 15** application running on **React 19** with **TypeScript**. Styling is managed using **Tailwind CSS**, while UI primitives leverage **Radix UI** components. The app integrates **Axios** for API calls and includes **Stripe** client libraries, **QR** libraries for code generation and scanning, and **jsPDF** for in-browser report generation.

## Key Features
- **QR code generation & scanning** for event check-in and attendee verification.
- **Report generation** with PDF exports for event insights and summaries.
- **Payments integration** for paid events.
- **Email notifications** for attendee communication.

## Clone the Repository
```bash
git clone https://github.com/<your-org-or-username>/eventwisp-fullstack.git
cd eventwisp-fullstack
```

> Replace the repository URL with the correct remote for your organization.
