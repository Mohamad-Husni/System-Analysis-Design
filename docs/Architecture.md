# System Architecture & Design

## 1. High-Level Architecture Overview

The Mistravora Core system utilizes a decoupled, modern architecture designed to support the real-time demands of **RT & DK Consumers (Pvt) Ltd**. Detailed visual representations can be found in the `/diagrams` directory:

- **Context DFD:** `../diagrams/Context_DFD.svg` - Maps the system boundary and external entities (Customer, Supplier, Manager).
- **UML Class Diagram:** `../diagrams/UML_Class_Diagram.svg` - Details the object-oriented structure (Product, Customer, Supplier, Sales Order, Order Item, User).
- **Sequence Diagram:** `../diagrams/Sequence_Diagram.svg` - Outlines the system communication flow for order fulfillment.

## 2. Technical Specifications: Data Dictionary

The foundational database layer is structured to enforce data integrity and rapid querying. Below is the technical data dictionary for the core relational tables.

### 2.1 Product Table

| Field Name | Data Type | Constraint/Format | Description |
| :--- | :--- | :--- | :--- |
| `ProductID` | `Integer(6)` | Primary Key | Unique identifier for each product. |
| `ProductName` | `Varchar(100)` | Not Null | Name of the product (e.g., Plastic Water Jug). |
| `Category` | `Varchar(50)` | Not Null | Product category (e.g., Kitchenware). |
| `UnitPrice` | `Decimal(10,2)`| Not Null | Price per unit. |
| `QuantityInStock` | `Integer(5)` | Default 0 | Current stock available. |
| `ReorderLevel` | `Integer(5)` | Not Null | Minimum stock level before alert. |
| `ExpiryDate` | `Date(10)` | YYYY-MM-DD | Expiry date for perishable products. |
| `BarcodeQR` | `Varchar(50)` | Unique | Barcode/QR code value. |

### 2.2 Customer Table

| Field Name | Data Type | Constraint/Format | Description |
| :--- | :--- | :--- | :--- |
| `CustomerID` | `Integer(6)` | Primary Key | Unique identifier for each customer. |
| `Name` | `Varchar(100)` | Not Null | Full name of customer. |
| `Phone` | `Varchar(15)` | +94XXXXXXXXX | Customer contact number. |
| `Email` | `Varchar(100)` | Unique | Customer email address. |
| `Address` | `Varchar(200)` | Not Null | Customer address. |

### 2.3 Supplier Table

| Field Name | Data Type | Constraint/Format | Description |
| :--- | :--- | :--- | :--- |
| `SupplierID` | `Integer(6)` | Primary Key | Unique identifier for each supplier. |
| `SupplierName` | `Varchar(100)` | Not Null | Name of supplier company/person. |
| `ContactNumber`| `Varchar(15)` | +94XXXXXXXXX | Supplier phone number. |
| `Email` | `Varchar(100)` | Unique | Supplier email address. |
| `Address` | `Varchar(200)` | Not Null | Supplier's business address. |

### 2.4 Sales Order Table

| Field Name | Data Type | Constraint/Format | Description |
| :--- | :--- | :--- | :--- |
| `OrderID` | `Integer(8)` | Primary Key | Unique sales order number. |
| `CustomerID` | `Integer(6)` | Foreign Key | Links order to customer. |
| `OrderDateTime`| `Date(19)` | YYYY-MM-DD hh:mm:ss | Date & time of order. |
| `TotalAmount` | `Decimal(10,2)`| Not Null | Total cost of the order. |
| `PaymentStatus`| `Varchar(20)` | Not Null | Status of payment ("Paid" / "Pending"). |

### 2.5 Order Item Table

| Field Name | Data Type | Constraint/Format | Description |
| :--- | :--- | :--- | :--- |
| `OrderItemID` | `Integer(8)` | Primary Key | Unique identifier for each order item. |
| `OrderID` | `Integer(8)` | Foreign Key | Links to Sales Order. |
| `ProductID` | `Integer(6)` | Foreign Key | Product sold. |
| `Quantity` | `Integer(5)` | Not Null | Quantity sold in this order. |
| `UnitPrice` | `Decimal(10,2)`| Not Null | Unit price at time of sale. |
| `Subtotal` | `Decimal(10,2)`| Not Null | Line total (Quantity × Unit Price). |

### 2.6 User Table

| Field Name | Data Type | Constraint/Format | Description |
| :--- | :--- | :--- | :--- |
| `UserID` | `Integer(6)` | Primary Key | Unique identifier for each system user. |
| `Username` | `Varchar(50)` | Unique | Login username. |
| `Password` | `Varchar(100)` | Encrypted | Encrypted password. |
| `Role` | `Varchar(20)` | Not Null | User role (Staff / Supervisor / Manager). |
| `Email` | `Varchar(100)` | Unique | Staff email address. |
