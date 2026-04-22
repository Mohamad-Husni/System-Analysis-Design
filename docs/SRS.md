# System Requirements Specification (SRS)

## 1. Problem Statement

Recent staff surveys at **RT & DK Consumers** have brought critical operational deficiencies to light. The current reliance on manual, spreadsheet-driven processes has resulted in:

1. **2-Hour Stock Check Delays:** Warehouse and floor staff are experiencing unacceptable lag times when attempting to verify current stock levels, crippling customer service responsiveness and daily operational velocity.
2. **Manual Entry Errors:** The manual transcription of stock deliveries and dispatch logs into Excel has introduced severe data integrity issues, leading to mismatched physical and digital inventories.

This system is engineered to eradicate these bottlenecks via full automation and real-time tracking.

## 2. SDLC Model: The Incremental Model

The development of the Mistravora Core system explicitly follows the **Incremental Model**. 

This chosen development path ensures that a core, working subset of the system (e.g., base inventory tracking) is deployed rapidly, yielding immediate operational benefits. Subsequent modules (e.g., predictive ordering, advanced reporting) will be integrated in successive, iterative increments. This mitigates risk and ensures that RT & DK Consumers see immediate value while the system evolves in a controlled, predictable manner.

## 3. Logic Layer Technical Specifications

The system's core business logic dictates how stock is verified and orders are processed.

### 3.1 Structured English

```text
BEGIN PROCESS Order_Fulfillment
  READ Customer_Order
  FOR EACH Item IN Customer_Order
    CHECK Inventory_Database FOR Item.Quantity
    IF Inventory_Database.Quantity >= Item.Quantity THEN
      ALLOCATE Item.Quantity TO Customer_Order
      UPDATE Inventory_Database.Quantity = Inventory_Database.Quantity - Item.Quantity
      LOG Transaction(Item, "Allocated")
    ELSE
      MARK Item AS "Backordered"
      TRIGGER Supplier_Reorder_Alert(Item)
    END IF
  END FOR
  GENERATE Dispatch_Note
END PROCESS
```

### 3.2 Decision Table

**Process: Stock Level Action Determination**

| Conditions | Rule 1 | Rule 2 | Rule 3 | Rule 4 |
| :--- | :---: | :---: | :---: | :---: |
| Stock > Reorder Level | Y | N | N | N |
| Stock == 0 (Stockout) | N | N | Y | Y |
| Pending Reorder exists? | - | Y | Y | N |
| **Actions** | | | | |
| Fulfill Normal Order | X | X | | |
| Notify Restock Needed | | | | X |
| Place Urgent Reorder | | | | X |
| Notify Customer Backorder| | | X | X |
