// src/restaurant/restaurant.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("simple-array")
  cuisineType: string[];

  @Column()
  locationAddress: string;

  @Column("decimal", { precision: 9, scale: 6 })
  latitude: number;

  @Column("decimal", { precision: 9, scale: 6 })
  longitude: number;

  @Column()
  radius: number;

  @Column("simple-array")
  mealType: string[];

  @Column("decimal")
  minPrice: number;

  @Column("decimal")
  maxPrice: number;

  @Column("decimal")
  rating: number;

  @Column()
  weekdayOpen: string;

  @Column()
  weekdayClose: string;

  @Column()
  weekendOpen: string;

  @Column()
  weekendClose: string;

  @Column("simple-array")
  availableTimes: string[];

  @Column({ default: false })
  budgetFriendly: boolean;

  @Column()
  reservationType: string;
}
