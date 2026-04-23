# System Requirements Specification (SRS)

## 1. Introduction & Problem Statement

**RT & DK Consumers (Pvt) Ltd** is a private company specializing in the supply of plastic essentials. Recent fact-finding surveys, interviews, and observations have highlighted critical operational deficiencies stemming from their current manual and Excel-based processes:

1. **Inaccuracies & Manual Entry Errors:** 73% of staff reported daily stock discrepancies, with 61% explicitly citing manual data entry as the root cause.
2. **Operational Delays:** Order processing currently takes 20–30 minutes per order, and completing a full stock check can take up to 2 hours.
3. **Stockouts & Customer Dissatisfaction:** There is no alert system, meaning products frequently run out unexpectedly before staff are aware, leading to delayed approvals and unhappy customers.

This proposed **Automated Inventory Tracking System** is engineered to eradicate these bottlenecks via full automation, barcode/QR scanning, real-time tracking, and automated reporting.

## 2. SDLC Model: The Incremental Model

The development of the RT & DK Core system explicitly follows the **Incremental Model**. 

This approach is best suited for RT & DK Consumers because it allows the development of the most important features first (e.g., barcode scanning, real-time stock updates, and low-stock alerts) so the system can start providing value quickly. Additional features (like advanced reporting) can be added in later increments, making it easier and less expensive to adapt to any necessary changes over time.

## 3. Logic Layer Technical Specifications

### 3.1 Structured English

```text
PROCESS Automated Inventory Tracking System
BEGIN 
FOR each Customer Order
    IF stock is available
        THEN generate Invoice
        AND confirm Order to Customer
        AND update Stock
    ELSE
        Notify Manager of Stockout
        AND trigger Purchase Order to Supplier
    ENDIF
END FOR

FOR each Supplier Delivery
    Verify items received
    Update Stock Records
    Generate Supply Confirmation
END FOR

FOR each Manager Request
    Generate Sales, Stock, and Performance Reports
END FOR
END
```

### 3.2 Decision Table

**Process: Inventory Action Determination**

| Conditions | Rule 1 | Rule 2 | Rule 3 | Rule 4 |
| :--- | :---: | :---: | :---: | :---: |
| C1: Stock Available | Y | N | - | - |
| C2: Supplier Delivery Arrived | - | - | Y | - |
| C3: Manager Requests Report | - | - | - | Y |
| **Actions** | | | | |
| A1: Confirm Order (Generate Invoice) | X | | | |
| A2: Notify Manager (Stockout / PO) | | X | | |
| A3: Update Stock | X | | X | |
| A4: Generate Report | | | | X |
