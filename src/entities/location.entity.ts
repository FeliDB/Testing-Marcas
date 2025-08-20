import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('location')
export class locationEntity {
  @PrimaryGeneratedColumn()
  idLocation: number;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;
}
