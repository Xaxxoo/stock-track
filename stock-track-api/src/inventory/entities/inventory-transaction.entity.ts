import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum ReferenceType {
  PURCHASE = 'PURCHASE',
  PRODUCTION = 'PRODUCTION',
  SALES = 'SALES',
  TRANSFER = 'TRANSFER',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('inventory_transactions')
@Index(['transactionNumber'], { unique: true })
@Index(['productId'])
@Index(['warehouseId'])
@Index(['createdAt'])
@Index(['transactionType'])
@Index(['referenceType', 'referenceId'])
export class InventoryTransaction {
  @ApiProperty({
    description: 'Unique identifier for the transaction',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Unique transaction number',
    example: 'TXN-2024-001234',
  })
  @Column({ name: 'transaction_number', unique: true, length: 50 })
  transactionNumber: string;

  @ApiProperty({
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ApiProperty({ description: 'Product details' })
  @ManyToOne('Product', { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: any;

  @ApiProperty({
    description: 'Warehouse ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @ApiProperty({ description: 'Warehouse details' })
  @ManyToOne('Warehouse', { eager: true })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: any;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.IN,
  })
  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: TransactionType,
  })
  transactionType: TransactionType;

  @ApiProperty({
    description: 'Quantity of items',
    example: 100.50,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Unit cost of the item',
    example: 25.99,
  })
  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  unitCost: number;

  @ApiProperty({
    description: 'Total cost (quantity × unit cost)',
    example: 2609.95,
  })
  @Column({
    name: 'total_cost',
    type: 'decimal',
    precision: 12,
    scale: 2,
    generated: 'STORED',
    asExpression: 'quantity * unit_cost',
  })
  totalCost: number;

  @ApiProperty({
    description: 'Reference type',
    enum: ReferenceType,
    example: ReferenceType.PURCHASE,
    required: false,
  })
  @Column({
    name: 'reference_type',
    type: 'enum',
    enum: ReferenceType,
    nullable: true,
  })
  referenceType: ReferenceType | null;

  @ApiProperty({
    description: 'Reference ID for related entity',
    example: '550e8400-e29b-41d4-a716-446655440003',
    required: false,
  })
  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string | null;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Monthly stock replenishment',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ApiProperty({
    description: 'User who created the transaction',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ApiProperty({ description: 'User details' })
  @ManyToOne('User')
  @JoinColumn({ name: 'created_by' })
  creator: any;

  @ApiProperty({
    description: 'Transaction creation timestamp',
    example: '2024-01-07T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Computed property for display
  @ApiProperty({
    description: 'Sign of quantity based on transaction type',
    example: 1,
  })
  get quantitySign(): number {
    return this.transactionType === TransactionType.IN ? 1 : -1;
  }

  @ApiProperty({
    description: 'Signed quantity for calculations',
    example: 100.50,
  })
  get signedQuantity(): number {
    return this.quantity * this.quantitySign;
  }
}