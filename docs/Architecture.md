# System Architecture & Design

## 1. High-Level Architecture Overview

The Mistravora Core system utilizes a decoupled, modern architecture designed to support the real-time demands of RT & DK Consumers. Detailed visual representations can be found in the `/diagrams` directory:

- **Context DFD:** `../diagrams/Context_DFD.svg` - Maps the system boundary and external entities.
- **UML Class Diagram:** `../diagrams/UML_Class_Diagram.svg` - Details the object-oriented structure.
- **Sequence Diagram:** `../diagrams/Sequence_Diagram.svg` - Outlines the QR scanner communication flow.

## 2. Technical Specifications: Data Dictionary

The foundational database layer is structured to enforce data integrity and rapid querying. Below is the technical data dictionary for the core relational tables.

### 2.1 Product Table (`tbl_Product`)

| Field Name | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `ProductID` | `Varchar(15)` | Primary Key | Unique identifier for the product (e.g., SKU). |
| `ProductName` | `Varchar(100)` | Not Null | Standardized name of the product. |
| `CategoryID` | `Varchar(10)` | Foreign Key | Link to product categorization. |
| `StockQuantity` | `Integer` | Not Null, Default 0 | Current on-hand quantity. |
| `UnitPrice` | `Decimal(10,2)`| Not Null | Current selling price of the item. |
| `ReorderLevel` | `Integer` | Not Null | Threshold that triggers a restock alert. |

### 2.2 Customer Table (`tbl_Customer`)

| Field Name | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `CustomerID` | `Varchar(15)` | Primary Key | Unique identifier for registered consumers. |
| `FullName` | `Varchar(150)` | Not Null | Complete name of the customer. |
| `EmailAddress`| `Varchar(100)` | Unique, Not Null | Contact and login email. |
| `PhoneNumber` | `Varchar(20)` | Nullable | Primary contact number. |
| `TotalSpent` | `Decimal(12,2)`| Default 0.00 | Aggregate value of all completed orders. |

### 2.3 Supplier Table (`tbl_Supplier`)

| Field Name | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `SupplierID` | `Varchar(15)` | Primary Key | Unique vendor identifier. |
| `CompanyName` | `Varchar(150)` | Not Null | Registered name of the supplying vendor. |
| `ContactPerson`| `Varchar(100)` | Not Null | Point of contact at the supplier. |
| `LeadTimeDays`| `Integer` | Not Null | Expected number of days for delivery after order. |
| `Rating` | `Decimal(3,2)` | Nullable | Internal quality/reliability rating (e.g., 4.50). |
