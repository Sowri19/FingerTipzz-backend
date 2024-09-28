# **Database Design and Architecture**

## **Overview**

This project leverages a hybrid database architecture using both SQL and NoSQL databases. We use **MySQL** for relational data and **MongoDB** for flexible data storage. This combination allows us to handle structured, transactional data (e.g., users, vendors, orders) using a relational model, while managing product and category data with high flexibility through a document-based approach.

---

## **Technology Choices**

### **Relational Database (SQL: MySQL)**

#### **Why MySQL?**

We selected MySQL for the following reasons:

- **Mature ecosystem**: MySQL is a robust and mature RDBMS with a large community and wide adoption.
- **ACID compliance**: MySQL ensures data consistency through ACID (Atomicity, Consistency, Isolation, Durability) properties, essential for critical transactional operations such as order processing.
- **Complex queries**: The relational model in MySQL allows for powerful JOIN operations, complex queries, and referential integrity, which are necessary to manage entities like Users, Vendors, Delivery Drivers, Orders, and Addresses.

#### **Why not PostgreSQL?**

- While PostgreSQL offers advanced features like JSONB for semi-structured data, the project’s focus on structured, transactional data doesn’t require these advanced features.
- MySQL’s simplicity and performance for high-read workloads align with our project's needs.

### **Document Database (NoSQL: MongoDB)**

#### **Why MongoDB?**

MongoDB was chosen to handle the product and category data due to:

- **Flexibility**: MongoDB allows storing documents with varying structures. Products may have different attributes (e.g., color, size, weight), and the schema flexibility lets us add attributes without altering the entire database schema.
- **Efficient querying**: MongoDB's indexing and aggregation framework enable efficient queries, even for complex, nested documents.
- **Schema evolution**: As the product catalog grows and changes, MongoDB allows for seamless schema evolution without downtime.

#### **Why not CouchDB or DynamoDB?**

- **CouchDB**: While CouchDB offers strong replication and sync features, MongoDB provides a richer query language, better support for complex aggregations, and more flexible schema design.
- **DynamoDB**: Amazon DynamoDB is an excellent choice for low-latency key-value stores but doesn't provide the same flexibility in querying and schema design as MongoDB, which is crucial for our product attributes and category data.

---

## **Data Models and Relationships**

We use MySQL for structured data that requires relational integrity and MongoDB for flexible, semi-structured data. The following sections describe the data models, tables, and relationships.

---

### **1. Users (SQL)**

The **User** entity stores all user-related information (customers, vendors, delivery drivers, admins). We maintain this data in MySQL to ensure referential integrity across different roles.

| **Field**      | **Data Type**  | **Description**                        |
| -------------- | -------------- | -------------------------------------- |
| `UserID`       | `INTEGER (PK)` | Unique identifier for the user         |
| `Username`     | `STRING`       | Unique username                        |
| `Email`        | `STRING`       | Unique email address                   |
| `PasswordHash` | `STRING`       | Encrypted password                     |
| `FirstName`    | `STRING`       | User's first name                      |
| `LastName`     | `STRING`       | User's last name                       |
| `UserType`     | `ENUM`         | Role (Customer, Vendor, Driver, Admin) |
| `CreatedAt`    | `DATE`         | Account creation date                  |
| `LastLogin`    | `DATE`         | Last login timestamp                   |
| `IsActive`     | `BOOLEAN`      | Whether the user account is active     |

- **User and Addresses**: A one-to-many (`1 --- *`) relationship exists between users and their addresses.
- **User and Vendor/Delivery Driver**: A one-to-one (`1 --- 1`) relationship exists between users and their vendor or delivery driver account.

---

### **2. Addresses (SQL)**

The **Address** entity stores multiple addresses for each user. Users can specify different address types (home, work, billing, shipping, etc.).

| **Field**       | **Data Type**  | **Description**                     |
| --------------- | -------------- | ----------------------------------- |
| `AddressID`     | `INTEGER (PK)` | Unique identifier for the address   |
| `UserID`        | `INTEGER (FK)` | Foreign key referencing the user    |
| `AddressType`   | `ENUM`         | Type of address (Home, Work, etc.)  |
| `StreetAddress` | `STRING`       | Street address                      |
| `City`          | `STRING`       | City                                |
| `State`         | `STRING`       | State                               |
| `PostalCode`    | `STRING`       | Postal code                         |
| `Country`       | `STRING`       | Country                             |
| `IsDefault`     | `BOOLEAN`      | Whether this is the default address |

---

### **3. Vendors (SQL)**

The **Vendor** table stores business details for users who are registered as vendors. Each vendor is associated with one user.

| **Field**      | **Data Type**  | **Description**                    |
| -------------- | -------------- | ---------------------------------- |
| `VendorID`     | `INTEGER (PK)` | Unique identifier for the vendor   |
| `UserID`       | `INTEGER (FK)` | Foreign key referencing the user   |
| `BusinessName` | `STRING`       | Vendor's business name             |
| `BusinessType` | `STRING`       | Type of business (e.g., Retail)    |
| `TaxID`        | `STRING`       | Vendor’s tax identification number |
| `IsVerified`   | `BOOLEAN`      | Whether the vendor is verified     |

- **Vendor and Stores**: A one-to-many (`1 --- *`) relationship between vendors and stores they own.

---

### **4. Delivery Drivers (SQL)**

The **DeliveryDriver** table contains information for users who are registered as delivery drivers.

| **Field**         | **Data Type**  | **Description**                           |
| ----------------- | -------------- | ----------------------------------------- |
| `DriverID`        | `INTEGER (PK)` | Unique identifier for the driver          |
| `UserID`          | `INTEGER (FK)` | Foreign key referencing the user          |
| `LicenseNumber`   | `STRING`       | Driver's license number                   |
| `VehicleType`     | `STRING`       | Type of vehicle the driver uses           |
| `IsAvailable`     | `BOOLEAN`      | Whether the driver is currently available |
| `CurrentLocation` | `GEOMETRY`     | Driver's current GPS location             |

---

### **5. Stores (SQL)**

The **Store** entity represents a store that belongs to a vendor. Each vendor can own multiple stores, and each store has multiple products.

| **Field**     | **Data Type**  | **Description**                    |
| ------------- | -------------- | ---------------------------------- |
| `StoreID`     | `INTEGER (PK)` | Unique identifier for the store    |
| `VendorID`    | `INTEGER (FK)` | Foreign key referencing the vendor |
| `Name`        | `STRING`       | Store name                         |
| `Description` | `TEXT`         | Detailed description of the store  |

- **Store and Products**: A one-to-many (`1 --- *`) relationship exists between stores and products they sell.

---

### **6. Products (NoSQL: MongoDB)**

The **Product** schema in MongoDB is highly flexible, allowing dynamic attributes and categories. Products belong to stores, and each product is associated with a category.

| **Field**     | **Data Type** | **Description**                       |
| ------------- | ------------- | ------------------------------------- |
| `name`        | `String`      | Product name                          |
| `description` | `String`      | Product description                   |
| `category`    | `ObjectId`    | Reference to category                 |
| `attributes`  | `Map`         | Custom attributes (color, size, etc.) |
| `price`       | `Number`      | Price of the product                  |
| `stock`       | `Number`      | Available stock quantity              |
| `images`      | `[String]`    | List of image URLs                    |

- **Product and Categories**: A product references a category in a many-to-one (`* --- 1`) relationship.

---

### **7. Orders (Mixed SQL and NoSQL)**

The **Order** schema is stored in MongoDB for flexibility, but references user and address data stored in MySQL.

| **Field**   | **Data Type** | **Description**                 |
| ----------- | ------------- | ------------------------------- |
| `OrderID`   | `String (PK)` | Unique identifier for the order |
| `UserID`    | `Integer`     | Reference to the user (SQL)     |
| `AddressID` | `Integer`     | Reference to the address (SQL)  |

           |

| `Products` | `Array` | List of product references (MongoDB) |
| `TotalAmount` | `Number` | Total order amount |
| `Status` | `String` | Order status (Pending, Shipped, etc.) |
| `CreatedAt` | `Date` | Order creation date |

---

## **Conclusion**

This hybrid SQL- and NoSQL-based architecture provides a robust system capable of handling transactional data and dynamic product information, ensuring scalability and flexibility while maintaining strong data consistency.

---
